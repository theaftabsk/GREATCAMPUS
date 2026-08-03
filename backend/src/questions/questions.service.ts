import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
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

  async getQuestions() {
    const assessment = await this.getOrCreateAssessment();

    const qList = await this.prisma.question.findMany({
      where: { assessmentId: assessment.id },
      orderBy: { createdAt: 'asc' },
    });

    return qList;
  }

  async addQuestion(data: any) {
    const assessment = await this.getOrCreateAssessment();
    return this.prisma.question.create({
      data: {
        assessmentId: assessment.id,
        section: data.section,
        sectionName: data.sectionName,
        question: data.question,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        marks: data.marks || 1,
        difficulty: data.difficulty || 'Medium',
      },
    });
  }

  async updateQuestion(id: string, data: any) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  async deleteQuestion(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }
}
