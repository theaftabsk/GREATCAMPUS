import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('api/v1/questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async getQuestions(
    @Query('sectionId') sectionId?: string,
    @Query('subjectId') subjectId?: string,
    @Query('assessmentId') assessmentId?: string
  ) {
    const questions = await this.questionsService.getQuestions(sectionId, subjectId, assessmentId);
    return { success: true, questions };
  }

  @Post()
  async addQuestion(
    @Body()
    body: {
      sectionId: string;
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: string;
      marks?: number;
    }
  ) {
    const question = await this.questionsService.addQuestion(body);
    return { success: true, question };
  }

  @Put(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body()
    body: {
      question?: string;
      optionA?: string;
      optionB?: string;
      optionC?: string;
      optionD?: string;
      correctAnswer?: string;
      marks?: number;
    }
  ) {
    const question = await this.questionsService.updateQuestion(id, body);
    return { success: true, question };
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: string) {
    await this.questionsService.deleteQuestion(id);
    return { success: true, message: 'Question deleted' };
  }
}
