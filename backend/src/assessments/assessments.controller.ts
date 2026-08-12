import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AssessmentsService } from './assessments.service';

@Controller('api/v1/assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get()
  async getAssessments() {
    const data = await this.assessmentsService.getAssessments();
    return { success: true, assessments: data };
  }

  @Get(':id')
  async getAssessmentById(@Param('id') id: string) {
    const data = await this.assessmentsService.getAssessmentById(id);
    return { success: true, assessment: data };
  }

  @Post()
  async createAssessment(
    @Body()
    body: {
      name: string;
      description?: string;
      activeFrom?: string;
      activeUntil?: string;
      passingPercentage?: number;
      maxProctorWarnings?: number;
      status?: string;
    }
  ) {
    const assessment = await this.assessmentsService.createAssessment(body);
    return { success: true, assessment };
  }

  @Put(':id')
  async updateAssessment(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      activeFrom?: string;
      activeUntil?: string;
      passingPercentage?: number;
      maxProctorWarnings?: number;
      status?: string;
    }
  ) {
    const assessment = await this.assessmentsService.updateAssessment(id, body);
    return { success: true, assessment };
  }

  @Delete(':id')
  async deleteAssessment(@Param('id') id: string) {
    await this.assessmentsService.deleteAssessment(id);
    return { success: true, message: 'Assessment deleted' };
  }
}
