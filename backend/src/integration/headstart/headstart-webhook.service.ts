import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HeadstartWebhookService {
  private readonly logger = new Logger(HeadstartWebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * API 4: Assessment Status API (OUT - Webhook)
   * Notify Headstart CRM in real-time when candidate status changes (Started, Completed, etc.)
   */
  async sendAssessmentStatus(attemptId: string, status: 'Started' | 'In Progress' | 'Completed'): Promise<boolean> {
    this.logger.log(`API 4 (OUT Webhook): Pushing Assessment Status '${status}' for attempt ${attemptId}`);

    try {
      const attempt = await this.prisma.examAttempt.findUnique({
        where: { id: attemptId },
        include: { candidate: true },
      });

      if (!attempt) {
        this.logger.error(`Attempt ${attemptId} not found for API 4 status webhook.`);
        return false;
      }

      const config = await this.prisma.integrationConfig.findFirst();
      const webhookUrl = config?.webhookStatusUrl || process.env.HEADSTART_WEBHOOK_STATUS_URL;

      const payload = {
        candidateId: attempt.candidate.crmCandidateId || attempt.candidateId,
        applicationId: attempt.candidate.applicationId || attempt.candidate.referenceId,
        assessmentId: attempt.candidate.assessmentId,
        status,
        startTime: attempt.startedAt.toISOString(),
      };

      if (!webhookUrl) {
        this.logger.log(`[API 4 Webhook Payload Prepared]: ${JSON.stringify(payload)} (No webhook URL configured yet)`);
        return true;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config?.crmApiKey ? { Authorization: `Bearer ${config.crmApiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      this.logger.log(`API 4 Webhook response: ${response.status}`);
      return response.ok;
    } catch (error) {
      this.logger.error(`Error delivering API 4 Status Webhook: ${error.message}`);
      return false;
    }
  }

  /**
   * API 5 & API 6: Assessment Result & Detailed Report Card API (OUT - Webhook)
   * Sends candidate marks, overall result, and subject/section-wise breakdown to Headstart CRM.
   */
  async sendAssessmentResultAndReportCard(attemptId: string): Promise<boolean> {
    this.logger.log(`API 5 & 6 (OUT Webhook): Pushing Result & Report Card for attempt ${attemptId}`);

    try {
      const attempt = await this.prisma.examAttempt.findUnique({
        where: { id: attemptId },
        include: {
          candidate: {
            include: {
              assessment: true,
            },
          },
          submissions: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!attempt) {
        this.logger.error(`Attempt ${attemptId} not found for API 5/6 result webhook.`);
        return false;
      }

      const config = await this.prisma.integrationConfig.findFirst();
      const webhookResultUrl = config?.webhookResultUrl || process.env.HEADSTART_WEBHOOK_RESULT_URL;
      const webhookReportUrl = config?.webhookReportUrl || process.env.HEADSTART_WEBHOOK_REPORT_URL;

      // Compute time taken in seconds
      const startTime = attempt.startedAt ? new Date(attempt.startedAt).getTime() : Date.now();
      const endTime = attempt.submittedAt ? new Date(attempt.submittedAt).getTime() : Date.now();
      const timeTakenSec = Math.max(0, Math.floor((endTime - startTime) / 1000));

      // Subject breakdown (Flat question bank — general module)
      let correctCount = 0;
      let totalCount = 0;
      attempt.submissions.forEach((sub) => {
        totalCount++;
        if (sub.isCorrect) correctCount++;
      });

      const subjectBreakdown = [
        {
          subjectName: "General Insurance & Banca Assessment",
          totalMarks: attempt.totalPossibleScore || totalCount,
          obtainedMarks: attempt.score || correctCount,
          percentage: attempt.percentage,
        },
      ];

      // API 5 Payload: Result
      const api5Payload = {
        candidateId: attempt.candidate.crmCandidateId || attempt.candidateId,
        applicationId: attempt.candidate.applicationId || attempt.candidate.referenceId,
        assessmentId: attempt.candidate.assessmentId,
        startTime: attempt.startedAt.toISOString(),
        endTime: attempt.submittedAt ? attempt.submittedAt.toISOString() : new Date().toISOString(),
        timeTaken: `${Math.floor(timeTakenSec / 60)} mins ${timeTakenSec % 60} secs`,
        totalMarks: attempt.totalPossibleScore,
        obtainedMarks: attempt.score,
        percentage: attempt.percentage,
        result: attempt.isPassed ? 'Qualified' : 'Not Qualified',
      };

      // API 6 Payload: Report Card
      const api6Payload = {
        candidateId: attempt.candidate.crmCandidateId || attempt.candidateId,
        applicationId: attempt.candidate.applicationId || attempt.candidate.referenceId,
        assessmentId: attempt.candidate.assessmentId,
        candidateName: attempt.candidate.name,
        subjectWiseMarks: subjectBreakdown,
        totalMarks: attempt.totalPossibleScore,
        obtainedMarks: attempt.score,
        percentage: attempt.percentage,
        result: attempt.isPassed ? 'Qualified' : 'Not Qualified',
      };

      this.logger.log(`[API 5 Webhook Payload Prepared]: ${JSON.stringify(api5Payload)}`);
      this.logger.log(`[API 6 Report Card Payload Prepared]: ${JSON.stringify(api6Payload)}`);

      // Dispatch Webhooks if endpoints exist
      if (webhookResultUrl) {
        await fetch(webhookResultUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.crmApiKey ? { Authorization: `Bearer ${config.crmApiKey}` } : {}),
          },
          body: JSON.stringify(api5Payload),
        }).catch((err) => this.logger.error(`Failed pushing API 5 Webhook: ${err.message}`));
      }

      if (webhookReportUrl) {
        await fetch(webhookReportUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config?.crmApiKey ? { Authorization: `Bearer ${config.crmApiKey}` } : {}),
          },
          body: JSON.stringify(api6Payload),
        }).catch((err) => this.logger.error(`Failed pushing API 6 Webhook: ${err.message}`));
      }

      return true;
    } catch (error) {
      this.logger.error(`Error delivering API 5/6 Result Webhook: ${error.message}`);
      return false;
    }
  }
}
