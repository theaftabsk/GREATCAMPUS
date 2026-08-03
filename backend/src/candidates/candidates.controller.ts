import { Controller, Get, Post, Body, NotFoundException } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

@Controller('api/v1/candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  async getCandidates() {
    const candidates = await this.candidatesService.getCandidates();
    return { success: true, candidates };
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; phone: string; referenceId: string }) {
    const candidate = await this.candidatesService.registerCandidate(body);
    return { success: true, candidate };
  }

  @Post('submit')
  async submit(@Body() body: any) {
    const candidate = await this.candidatesService.submitExam(
      body.candidateId,
      body.answers,
      body.simulation,
      body.antiCheatData
    );

    if (!candidate) {
      throw new NotFoundException('Candidate record not found');
    }

    return {
      success: true,
      message: 'Assessment submitted successfully. The HR team will review your result.',
      candidateId: candidate.id,
      referenceId: candidate.referenceId,
    };
  }

  @Post('grade-simulation')
  async gradeSimulation(@Body() body: { candidateId: string; score: number; feedback: string; gradedBy?: string }) {
    const candidate = await this.candidatesService.gradeSimulation(body.candidateId, body.score, body.feedback, body.gradedBy);
    return { success: true, candidate };
  }
}
