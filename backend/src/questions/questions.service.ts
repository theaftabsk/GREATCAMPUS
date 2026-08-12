import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  // Get all questions from the shared question bank
  async getQuestions() {
    return this.prisma.question.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async addQuestion(data: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    marks?: number;
  }) {
    return this.prisma.question.create({
      data: {
        question: data.question,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correctAnswer: data.correctAnswer,
        marks: data.marks ?? 1,
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
      status?: string;
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
