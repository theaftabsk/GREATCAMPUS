import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

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

    const percentage = Math.max(0, Math.round((totalScore / (allQuestions.length || 60)) * 100));

    let recommendation: 'Strong Hire' | 'Hire' | 'Maybe' | 'Reject' = 'Reject';
    if (percentage >= 85) recommendation = 'Strong Hire';
    else if (percentage >= 70) recommendation = 'Hire';
    else if (percentage >= 55) recommendation = 'Maybe';

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
      await this.prisma.simulationResponse.upsert({
        where: { candidateId: candidate.id },
        update: {
          textResponse: simulation.textResponse,
          audioUrl: simulation.audioData,
        },
        create: {
          candidateId: candidate.id,
          textResponse: simulation.textResponse,
          audioUrl: simulation.audioData,
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
