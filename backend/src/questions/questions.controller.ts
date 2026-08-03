import { Controller, Get, Post, Put, Delete, Body, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('api/v1/questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  async getQuestions() {
    const questions = await this.questionsService.getQuestions();
    return { success: true, questions };
  }

  @Post()
  async addQuestion(@Body() body: any) {
    const question = await this.questionsService.addQuestion(body);
    return { success: true, question };
  }

  @Put()
  async updateQuestion(@Body() body: any) {
    const { id, ...updated } = body;
    const question = await this.questionsService.updateQuestion(id, updated);
    return { success: true, question };
  }

  @Delete()
  async deleteQuestion(@Query('id') id: string) {
    await this.questionsService.deleteQuestion(id);
    return { success: true };
  }
}
