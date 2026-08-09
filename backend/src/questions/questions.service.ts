import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(sectionId?: string, subjectId?: string, assessmentId?: string) {
    let whereClause: any = {};

    if (sectionId) {
      whereClause.sectionId = sectionId;
    } else if (subjectId) {
      whereClause.section = { subjectId };
    } else if (assessmentId) {
      whereClause.section = { subject: { assessmentId } };
    }

    return this.prisma.question.findMany({
      where: whereClause,
      include: {
        section: {
          include: {
            subject: {
              include: {
                assessment: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addQuestion(data: {
    sectionId: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    marks?: number;
  }) {
    const section = await this.prisma.subjectSection.findUnique({ where: { id: data.sectionId } });
    if (!section) {
      throw new NotFoundException(`Section not found for ID: ${data.sectionId}`);
    }

    return this.prisma.question.create({
      data: {
        sectionId: data.sectionId,
        question: data.question,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        marks: data.marks ?? 1,
      },
      include: {
        section: { include: { subject: true } },
      },
    });
  }

  async updateQuestion(
    id: string,
    data: {
      question?: string;
      optionA?: string;
      optionB?: string;
      optionC?: string;
      optionD?: string;
      correctAnswer?: string;
      marks?: number;
    }
  ) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  async deleteQuestion(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }
}
