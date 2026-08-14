import { Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

@Controller('api/v1/candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  // --- ASSESSMENT SESSION ROUTES (MUST COME BEFORE :id DYNAMIC ROUTES) ---
  @Get('assessments/list')
  async getAllAssessments() {
    const assessments = await this.candidatesService.getAllAssessments();
    return { success: true, assessments };
  }

  @Get('assessments/details/:identifier')
  async getAssessmentByIdentifier(@Param('identifier') identifier: string) {
    const assessment = await this.candidatesService.getAssessmentByIdentifier(identifier);
    return { success: true, assessment };
  }

  @Post('assessments/save')
  async createOrUpdateAssessment(
    @Body()
    body: {
      id?: string;
      name: string;
      slug?: string;
      description?: string;
      durationMins?: number;
      activeFrom?: string;
      activeUntil?: string;
      activeHours?: number;
      passingPercentage?: number;
      maxProctorWarnings?: number;
      status?: string;
    }
  ) {
    const assessment = await this.candidatesService.createOrUpdateAssessment(body);
    return { success: true, assessment };
  }

  @Delete('assessments/:id')
  async deleteAssessment(@Param('id') id: string) {
    await this.candidatesService.deleteAssessment(id);
    return { success: true, message: 'Assessment deleted successfully' };
  }

  // --- CANDIDATE ROUTES ---
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

  @Post(':id/unlock')
  async unlockCandidate(
    @Param('id') id: string,
    @Body() body: { adminId?: string; adminName?: string; reason?: string }
  ) {
    const result = await this.candidatesService.unlockCandidate(
      id,
      body.adminId || 'admin',
      body.adminName || 'HR Administrator',
      body.reason,
    );
    return result;
  }

  @Get(':id/report')
  async getCandidateReport(@Param('id') id: string) {
    return this.candidatesService.getCandidateReport(id);
  }

  @Post(':id/remarks')
  async saveCandidateRemarks(
    @Param('id') id: string,
    @Body() body: { adminId?: string; remark: string }
  ) {
    return this.candidatesService.saveCandidateRemarks(id, body.adminId || 'admin', body.remark);
  }

  @Post(':id/reset')
  async resetCandidate(@Param('id') id: string) {
    const candidate = await this.candidatesService.resetCandidate(id);
    return { success: true, message: 'Candidate fully reset', candidate };
  }

  @Delete(':id')
  async deleteCandidate(@Param('id') id: string) {
    await this.candidatesService.deleteCandidate(id);
    return { success: true, message: 'Candidate deleted' };
  }
}
