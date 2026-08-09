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
      durationMins?: number;
      passingPercentage?: number;
      maxProctorWarnings?: number;
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
      durationMins?: number;
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

  // --- SUBJECT CONTROLLERS ---
  @Post(':assessmentId/subjects')
  async addSubject(@Param('assessmentId') assessmentId: string, @Body() body: { name: string }) {
    const subject = await this.assessmentsService.addSubject(assessmentId, body.name);
    return { success: true, subject };
  }

  @Put('subjects/:id')
  async updateSubject(@Param('id') id: string, @Body() body: { name: string }) {
    const subject = await this.assessmentsService.updateSubject(id, body.name);
    return { success: true, subject };
  }

  @Delete('subjects/:id')
  async deleteSubject(@Param('id') id: string) {
    await this.assessmentsService.deleteSubject(id);
    return { success: true, message: 'Subject deleted' };
  }

  // --- SECTION CONTROLLERS ---
  @Post('subjects/:subjectId/sections')
  async addSection(
    @Param('subjectId') subjectId: string,
    @Body() body: { name: string; questionsToAsk?: number }
  ) {
    const section = await this.assessmentsService.addSection(subjectId, body.name, body.questionsToAsk);
    return { success: true, section };
  }

  @Put('sections/:id')
  async updateSection(
    @Param('id') id: string,
    @Body() body: { name?: string; questionsToAsk?: number }
  ) {
    const section = await this.assessmentsService.updateSection(id, body.name, body.questionsToAsk);
    return { success: true, section };
  }

  @Delete('sections/:id')
  async deleteSection(@Param('id') id: string) {
    await this.assessmentsService.deleteSection(id);
    return { success: true, message: 'Section deleted' };
  }
}
