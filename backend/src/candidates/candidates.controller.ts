import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

@Controller('api/v1/candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  async getCandidates(@Query('assessmentId') assessmentId?: string) {
    const candidates = await this.candidatesService.getCandidates(assessmentId);
    return { success: true, candidates };
  }

  @Post('register')
  async registerCandidate(
    @Body()
    body: {
      name: string;
      email: string;
      phone: string;
      assessmentId: string;
      referenceId?: string;
      applicationId?: string;
    }
  ) {
    const candidate = await this.candidatesService.registerCandidate(body);
    return { success: true, candidate };
  }

  @Post('verify-and-start')
  async verifyAndStartExam(
    @Body()
    body: {
      applicationId: string;
      assessmentId: string;
      name?: string;
      email?: string;
      phone?: string;
    }
  ) {
    const data = await this.candidatesService.verifyAndStartExam(body);
    return { success: true, ...data };
  }

  @Post('start-exam')
  async startExamSession(@Body() body: { candidateIdentifier: string }) {
    const data = await this.candidatesService.startExamSession(body.candidateIdentifier);
    return { success: true, ...data };
  }

  @Post('submit-exam')
  async submitExam(
    @Body()
    body: {
      attemptId: string;
      answers: Record<string, { selectedOption: string | null; timeTakenSec: number }>;
    }
  ) {
    const attempt = await this.candidatesService.submitExam(body.attemptId, body.answers);
    return { success: true, attempt };
  }

  @Post('log-proctoring')
  async logProctoringEvent(
    @Body()
    body: {
      attemptId: string;
      eventType: string;
      details?: string;
    }
  ) {
    const result = await this.candidatesService.logProctoringEvent(body.attemptId, body.eventType, body.details);
    return { success: true, ...result };
  }

  @Post(':id/reset')
  async resetCandidate(@Param('id') id: string) {
    const candidate = await this.candidatesService.resetCandidate(id);
    return { success: true, message: 'Candidate reset successfully for retake', candidate };
  }

  @Delete(':id')
  async deleteCandidate(@Param('id') id: string) {
    await this.candidatesService.deleteCandidate(id);
    return { success: true, message: 'Candidate deleted' };
  }
}
