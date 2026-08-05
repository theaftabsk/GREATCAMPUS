import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  private saveAudioFile(candidateId: string, audioData: string): string {
    if (!audioData) return '';
    if (!audioData.startsWith('data:audio/')) return audioData;

    try {
      const matches = audioData.match(/^data:audio\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) return audioData;

      const ext = matches[1] === 'mp4' ? 'mp4' : 'webm';
      const base64Content = matches[2];
      const buffer = Buffer.from(base64Content, 'base64');

      const uploadDir = path.join(process.cwd(), 'uploads', 'recordings');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `voice_${candidateId}_${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      return `/uploads/recordings/${filename}`;
    } catch (err) {
      console.error('Failed to save audio file to disk:', err);
      return audioData;
    }
  }

  private async getOrCreateAssessment() {
    let assessment = await this.prisma.assessment.findFirst();
    if (!assessment) {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: 'greatcampus' } }) ||
        await this.prisma.tenant.create({ data: { name: 'GREATCAMPUS', slug: 'greatcampus' } });

      assessment = await this.prisma.assessment.create({
        data: {
          title: 'Assistant Relationship Manager – Banca Channel',
          tenantId: tenant.id,
        },
      });
    }
    return assessment;
  }

  async getCandidates() {
    return this.prisma.candidate.findMany({
      include: {
        submissions: { include: { question: true } },
        simulation: true,
        proctoringLogs: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async registerCandidate(data: { name: string; email: string; phone: string; referenceId: string }) {
    const assessment = await this.getOrCreateAssessment();
    return this.prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        referenceId: data.referenceId,
        assessmentId: assessment.id,
      },
    });
  }

  async submitExam(
    candidateId: string,
    answers: Record<string, { selectedOption: string | null; timeTakenSec: number }>,
    simulation?: { audioData?: string; textResponse?: string },
    antiCheatData?: { tabSwitches: number; fullscreenExits: number; logs: Array<{ eventType: string; details?: string }> }
  ) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { OR: [{ id: candidateId }, { referenceId: candidateId }] },
    });

    if (!candidate) return null;

    const allQuestions = await this.prisma.question.findMany({ where: { assessmentId: candidate.assessmentId } });
    let totalScore = 0;

    for (const q of allQuestions) {
      const selected = answers[q.id]?.selectedOption || null;
      const isCorrect = selected === q.correctAnswer;
      const timeTaken = answers[q.id]?.timeTakenSec || 0;

      if (isCorrect) totalScore += q.marks;

      await this.prisma.submission.create({
        data: {
          candidateId: candidate.id,
          questionId: q.id,
          selectedOption: selected,
          isCorrect,
          timeTakenSec: timeTaken,
        },
      });
    }

    const totalQuestionsCount = allQuestions.length || 30;
    const percentage = Math.max(0, Math.round((totalScore / totalQuestionsCount) * 100));

    let recommendation: 'Strong Hire' | 'Hire' | 'Maybe' | 'Reject' = 'Reject';
    if (totalScore >= 25 || percentage >= 85) recommendation = 'Strong Hire';
    else if (totalScore >= 18 || percentage >= 60) recommendation = 'Hire';
    else if (totalScore >= 10 || percentage >= 33.33) recommendation = 'Maybe';

    await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        submittedAt: new Date(),
        status: 'COMPLETED',
        score: totalScore,
        totalPossibleScore: allQuestions.length,
        percentage,
        hiringRecommendation: recommendation,
        tabSwitches: antiCheatData?.tabSwitches || candidate.tabSwitches,
        fullscreenExits: antiCheatData?.fullscreenExits || candidate.fullscreenExits,
      },
    });

    if (simulation) {
      let savedAudioUrl = simulation.audioData || null;
      if (simulation.audioData && simulation.audioData.startsWith('data:audio/')) {
        savedAudioUrl = this.saveAudioFile(candidate.id, simulation.audioData);
      }

      await this.prisma.simulationResponse.upsert({
        where: { candidateId: candidate.id },
        update: {
          textResponse: simulation.textResponse,
          audioUrl: savedAudioUrl,
        },
        create: {
          candidateId: candidate.id,
          textResponse: simulation.textResponse,
          audioUrl: savedAudioUrl,
          score: 0,
          marksMax: 30,
        },
      });
    }

    if (antiCheatData?.logs) {
      for (const log of antiCheatData.logs) {
        await this.prisma.proctoringLog.create({
          data: {
            candidateId: candidate.id,
            eventType: log.eventType,
            details: log.details,
          },
        });
      }
    }

    return this.prisma.candidate.findUnique({
      where: { id: candidate.id },
      include: { simulation: true, proctoringLogs: true },
    });
  }

  async gradeSimulation(candidateId: string, score: number, feedback: string, gradedBy: string = 'HR Admin') {
    await this.prisma.simulationResponse.update({
      where: { candidateId },
      data: {
        score: Math.min(30, Math.max(0, score)),
        feedback,
        gradedAt: new Date(),
        gradedBy,
      },
    });

    return this.prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { simulation: true, proctoringLogs: true },
    });
  }

  async deleteCandidate(id: string) {
    return this.prisma.candidate.delete({
      where: { id },
    });
  }
}
