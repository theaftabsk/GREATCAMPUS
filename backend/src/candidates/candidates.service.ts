import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HeadstartClientService } from '../integration/headstart/headstart-client.service';
import { HeadstartWebhookService } from '../integration/headstart/headstart-webhook.service';

// ─── SYSTEM CONSTANTS ─────────────────────────────────────────────────────────
// These are fixed for ALL assessments. Admins cannot override them.
const EXAM_DURATION_MINS = 45;
const TOTAL_QUESTIONS = 60;
// ──────────────────────────────────────────────────────────────────────────────

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(
    private prisma: PrismaService,
    private headstartClient: HeadstartClientService,
    private headstartWebhook: HeadstartWebhookService,
  ) {}

  // ─── GET CANDIDATES ────────────────────────────────────────────────────────
  async getCandidates(assessmentId?: string) {
    const whereClause: any = {};
    if (assessmentId) whereClause.assessmentId = assessmentId;

    const candidates = await this.prisma.candidate.findMany({
      where: whereClause,
      include: {
        assessment: true,
        attempts: {
          orderBy: { startedAt: 'desc' },
          include: {
            attemptQuestions: {
              include: { question: true },
            },
            submissions: true,
            proctoringLogs: { orderBy: { timestamp: 'asc' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return candidates.map((cand) => {
      const latestAttempt = cand.attempts[0] || null;
      let questionAudit: any[] = [];

      if (latestAttempt) {
        questionAudit = latestAttempt.attemptQuestions.map((aq) => {
          const q = aq.question;
          const sub = latestAttempt.submissions.find((s) => s.questionId === q.id);
          return {
            questionOrder: aq.questionOrder,
            questionText: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            selectedOption: sub?.selectedOption || null,
            correctAnswer: q.correctAnswer,
            isCorrect: sub?.isCorrect || false,
            marks: aq.marks,
          };
        });
      }

      return {
        id: cand.id,
        name: cand.name,
        email: cand.email,
        phone: cand.phone,
        applicationId: cand.applicationId,
        referenceId: cand.referenceId,
        status: cand.status,
        createdAt: cand.createdAt,
        assessment: {
          id: cand.assessment.id,
          name: cand.assessment.name,
          slug: cand.assessment.slug,
        },
        attempt: latestAttempt
          ? {
              id: latestAttempt.id,
              status: latestAttempt.status,
              startedAt: latestAttempt.startedAt,
              submittedAt: latestAttempt.submittedAt,
              score: latestAttempt.score,
              totalPossibleScore: latestAttempt.totalPossibleScore,
              percentage: latestAttempt.percentage,
              isPassed: latestAttempt.isPassed,
              warningCount: latestAttempt.warningCount,
              maxProctorWarnings: latestAttempt.maxProctorWarningsSnapshot,
              durationMins: EXAM_DURATION_MINS,
              lockedAt: latestAttempt.lockedAt,
              lockReason: latestAttempt.lockReason,
              unlockedAt: latestAttempt.unlockedAt,
              unlockedByAdminName: latestAttempt.unlockedByAdminName,
              questionAudit,
              proctoringLogs: latestAttempt.proctoringLogs,
            }
          : null,
      };
    });
  }

  // ─── REGISTER CANDIDATE ────────────────────────────────────────────────────
  async registerCandidate(data: {
    name: string;
    email: string;
    phone: string;
    assessmentId: string;
    referenceId?: string;
    applicationId?: string;
  }) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id: data.assessmentId } });
    if (!assessment) {
      throw new NotFoundException(`Assigned Assessment not found.`);
    }

    const refId = data.referenceId || `REF-${Date.now().toString().slice(-6)}`;

    const existing = await this.prisma.candidate.findFirst({
      where: {
        OR: [
          { referenceId: refId },
          { email: data.email },
          ...(data.applicationId ? [{ applicationId: data.applicationId }] : []),
        ],
      },
    });

    if (existing) {
      return this.prisma.candidate.update({
        where: { id: existing.id },
        data: {
          assessmentId: data.assessmentId,
          name: data.name,
          phone: data.phone,
          ...(data.applicationId && { applicationId: data.applicationId }),
        },
        include: { assessment: true },
      });
    }

    return this.prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        referenceId: refId,
        applicationId: data.applicationId || null,
        assessmentId: data.assessmentId,
      },
      include: { assessment: true },
    });
  }

  // ─── VERIFY AND START EXAM (Headstart CRM Flow) ───────────────────────────
  async verifyAndStartExam(data: {
    applicationId: string;
    assessmentId?: string;
    identifier?: string;
    name?: string;
    email?: string;
    phone?: string;
  }) {
    const rawId = data.assessmentId || data.identifier || 'aa-2812';
    this.logger.log(`Verifying candidate for Application ID: ${data.applicationId}, Assessment: ${rawId}`);

    // Resolve Assessment from DB (by ID or Slug)
    let assessment = await this.prisma.assessment.findFirst({
      where: { OR: [{ id: rawId }, { slug: rawId }] },
    });

    if (!assessment) {
      assessment = await this.prisma.assessment.findFirst({ where: { status: 'ACTIVE' } });
    }

    const actualAssessmentId = assessment ? assessment.id : rawId;

    // Step 1: Verify candidate with Headstart CRM (if enabled/configured)
    const crmDetails = await this.headstartClient.verifyCandidate(data.applicationId);
    if (!crmDetails.success) {
      this.logger.warn(`CRM Verification fallback enabled for Application ID: ${data.applicationId}`);
    }

    // Step 2: Verify assignment in Headstart CRM
    const crmAssignment = await this.headstartClient.verifyAssignment(data.applicationId, actualAssessmentId);

    // Step 3: Register / Find candidate locally
    const name = data.name || crmDetails.name || 'Candidate';
    const email = data.email || crmDetails.email || `${data.applicationId.toLowerCase()}@candidate.com`;
    const phone = data.phone || crmDetails.phone || '0000000000';

    let candidate = await this.prisma.candidate.findFirst({
      where: {
        OR: [
          { applicationId: data.applicationId },
          { referenceId: data.applicationId },
        ],
      },
    });

    if (!candidate) {
      const refId = `${data.applicationId}-${actualAssessmentId.slice(0, 8)}`;
      candidate = await this.prisma.candidate.create({
        data: {
          name,
          email,
          phone,
          applicationId: data.applicationId,
          crmCandidateId: crmDetails.crmCandidateId || null,
          referenceId: refId,
          assessmentId: actualAssessmentId,
          status: 'REGISTERED',
        },
      });
    } else {
      // Check if candidate is LOCKED or DISQUALIFIED
      if (candidate.status === 'LOCKED' || candidate.status === 'DISQUALIFIED') {
        const lockedAttempt = await this.prisma.examAttempt.findFirst({
          where: { candidateId: candidate.id, OR: [{ status: 'LOCKED' }, { status: 'DISQUALIFIED' }] },
        });
        if (lockedAttempt) {
          throw new BadRequestException(
            `Your exam session is LOCKED due to proctoring warnings. Reason: ${lockedAttempt.lockReason || 'Proctoring violations'}. Please contact your HR Administrator to unlock your exam.`
          );
        }
      }
      // Update candidate snapshot with latest CRM data
      await this.prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          name,
          email,
          phone,
          crmCandidateId: crmDetails.crmCandidateId || candidate.crmCandidateId,
        },
      });
    }

    // Step 4: Start exam session
    const sessionData = await this.startExamSession(candidate.id);

    // Step 5: Fire API 4 Status Webhook (Status = Started)
    if (sessionData && sessionData.attemptId) {
      await this.headstartWebhook.sendAssessmentStatus(sessionData.attemptId, 'Started');
    }

    return sessionData;
  }

  // ─── START EXAM SESSION ────────────────────────────────────────────────────
  // Fixed: EXAM_DURATION_MINS = 45, TOTAL_QUESTIONS = 60 from Shared Question Bank
  async startExamSession(candidateIdentifier: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { OR: [{ id: candidateIdentifier }, { referenceId: candidateIdentifier }] },
      include: { assessment: true },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found.');
    }

    // Check for an existing active attempt (resume support)
    const activeAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        candidateId: candidate.id,
        status: 'IN_PROGRESS',
      },
      include: {
        attemptQuestions: {
          orderBy: { questionOrder: 'asc' },
          include: { question: true },
        },
        submissions: true,
      },
    });

    if (activeAttempt) {
      // Calculate accurate remaining time:
      // total available seconds - (totalTimeSpentSec from previous sessions + seconds spent in current active session)
      const totalDurationSec = (activeAttempt.durationMinsSnapshot || candidate.assessment.durationMins || EXAM_DURATION_MINS) * 60;
      const now = Date.now();
      const currentSessionElapsed = activeAttempt.startedAt
        ? Math.floor((now - new Date(activeAttempt.startedAt).getTime()) / 1000)
        : 0;
      const totalSpentSec = (activeAttempt.totalTimeSpentSec || 0) + Math.max(0, currentSessionElapsed);
      const remainingTimeSec = Math.max(30, totalDurationSec - totalSpentSec);

      // Return the existing attempt so candidate can resume seamlessly
      return {
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          referenceId: candidate.referenceId,
        },
        attemptId: activeAttempt.id,
        assessmentName: candidate.assessment.name,
        durationMins: activeAttempt.durationMinsSnapshot || candidate.assessment.durationMins || EXAM_DURATION_MINS,
        remainingTimeSec,
        maxProctorWarnings: activeAttempt.maxProctorWarningsSnapshot,
        warningCount: activeAttempt.warningCount,
        questions: activeAttempt.attemptQuestions.map((aq) => ({
          attemptQuestionId: aq.id,
          id: aq.question.id,
          subjectId: '',
          subjectName: aq.question.sectionName || 'General',
          sectionId: '',
          sectionName: aq.question.sectionName || 'General',
          question: aq.question.question,
          optionA: aq.question.optionA,
          optionB: aq.question.optionB,
          optionC: aq.question.optionC,
          optionD: aq.question.optionD,
          marks: aq.marks,
          selectedOption: activeAttempt.submissions.find((s) => s.questionId === aq.questionId)?.selectedOption || null,
        })),
      };
    }

    // Create a new attempt with configurable session minute snapshot
    const attempt = await this.prisma.examAttempt.create({
      data: {
        candidateId: candidate.id,
        status: 'IN_PROGRESS',
        durationMinsSnapshot: candidate.assessment.durationMins || EXAM_DURATION_MINS,
        passingPercentageSnapshot: candidate.assessment.passingPercentage || 50.0,
        maxProctorWarningsSnapshot: candidate.assessment.maxProctorWarnings || 3,
        startedAt: new Date(),
      },
    });

    // Fetch all active questions from the Shared Question Bank
    const allQuestions = await this.prisma.question.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
      take: TOTAL_QUESTIONS,
    });

    if (allQuestions.length === 0) {
      throw new BadRequestException('No active questions found in the question bank. Please contact the administrator.');
    }

    // Create AttemptQuestion records (1 per question, sequential order)
    await this.prisma.attemptQuestion.createMany({
      data: allQuestions.map((q, idx) => ({
        attemptId: attempt.id,
        questionId: q.id,
        questionOrder: idx + 1,
        marks: q.marks || 1.0,
      })),
    });

    // Update candidate status
    await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: 'IN_PROGRESS' },
    });

    // Retrieve the created attempt with questions
    const createdAttempt = await this.prisma.examAttempt.findUnique({
      where: { id: attempt.id },
      include: {
        attemptQuestions: {
          orderBy: { questionOrder: 'asc' },
          include: { question: true },
        },
      },
    });

    if (!createdAttempt) {
      throw new NotFoundException('Failed to retrieve created exam attempt.');
    }

    return {
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        referenceId: candidate.referenceId,
      },
      attemptId: createdAttempt.id,
      assessmentName: candidate.assessment.name,
      durationMins: createdAttempt.durationMinsSnapshot,
      maxProctorWarnings: createdAttempt.maxProctorWarningsSnapshot,
      warningCount: 0,
      questions: createdAttempt.attemptQuestions.map((aq) => ({
        attemptQuestionId: aq.id,
        id: aq.question.id,
        question: aq.question.question,
        optionA: aq.question.optionA,
        optionB: aq.question.optionB,
        optionC: aq.question.optionC,
        optionD: aq.question.optionD,
        marks: aq.marks,
        selectedOption: null,
      })),
    };
  }

  // ─── SUBMIT EXAM ───────────────────────────────────────────────────────────
  async submitExam(attemptId: string, answers: Record<string, any>) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        attemptQuestions: { include: { question: true } },
        candidate: true,
      },
    });

    if (!attempt) throw new NotFoundException('Exam attempt not found.');

    // If candidate is already LOCKED, DISQUALIFIED, or reached max warnings, preserve LOCKED status!
    if (attempt.status === 'LOCKED' || attempt.status === 'DISQUALIFIED' || attempt.warningCount >= attempt.maxProctorWarningsSnapshot) {
      this.logger.warn(`Submit attempted for LOCKED candidate attempt ${attemptId}. Preserving LOCKED status.`);
      return attempt;
    }
    if (attempt.status === 'COMPLETED') {
      return attempt;
    }

    let totalScore = 0;
    let totalPossibleScore = 0;

    const checkAnswerMatch = (selected: string | null, correctAnswer: string): boolean => {
      if (!selected || !correctAnswer) return false;
      const selNorm = selected.trim().toUpperCase().replace(/^OPTION\s+/, '');
      const corNorm = correctAnswer.trim().toUpperCase().replace(/^OPTION\s+/, '');
      return selNorm === corNorm;
    };

    for (const aq of attempt.attemptQuestions) {
      const q = aq.question;
      const ansObj = answers[q.id] || answers[aq.id] || answers[aq.questionId];
      let selected: string | null = null;

      if (typeof ansObj === 'string') {
        selected = ansObj;
      } else if (ansObj && typeof ansObj === 'object') {
        selected = ansObj.selectedOption || null;
      }

      const isCorrect = checkAnswerMatch(selected, q.correctAnswer);
      const timeTaken = (ansObj && typeof ansObj === 'object' && ansObj.timeTakenSec) ? ansObj.timeTakenSec : 0;

      totalPossibleScore += aq.marks;
      if (isCorrect) totalScore += aq.marks;

      await this.prisma.submission.create({
        data: {
          attemptId: attempt.id,
          questionId: q.id,
          selectedOption: selected,
          isCorrect,
          timeTakenSec: timeTaken,
        },
      });
    }

    const percentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
    const isPassed = percentage >= attempt.passingPercentageSnapshot;
    const submittedAt = new Date();

    // ─── STEP 1: DB save FIRST (submittedAt + result must be persisted before webhooks) ───
    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        submittedAt,
        status: 'COMPLETED',
        score: totalScore,
        totalPossibleScore,
        percentage,
        isPassed,
      },
    });

    await this.prisma.candidate.update({
      where: { id: attempt.candidateId },
      data: { status: 'COMPLETED' },
    });

    // ─── STEP 2: Fire Headstart OUT Webhooks AFTER DB is fully updated ─────────
    // Order guaranteed: API 4 (COMPLETED) → API 5 (Result) → API 6 (Report Card)
    try {
      await this.headstartWebhook.sendAssessmentStatus(updatedAttempt.id, 'Completed');
      await this.headstartWebhook.sendAssessmentResultAndReportCard(updatedAttempt.id);
    } catch (err) {
      this.logger.error(`Error firing post-submission webhooks: ${err.message}`);
    }

    return updatedAttempt;
  }

  // ─── REAL-TIME ANSWER PERSISTENCE ─────────────────────────────────────────
  async saveAnswer(data: {
    attemptId: string;
    questionId: string;
    selectedOption: string | null;
    timeTakenSec?: number;
  }) {
    const { attemptId, questionId, selectedOption, timeTakenSec = 0 } = data;

    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });
    if (!attempt) throw new NotFoundException('Exam attempt not found.');
    if (attempt.status === 'LOCKED' || attempt.status === 'COMPLETED' || attempt.status === 'DISQUALIFIED') {
      throw new BadRequestException(`Cannot save answer. Exam session is ${attempt.status}.`);
    }

    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    const isCorrect = !!(
      question &&
      selectedOption &&
      question.correctAnswer?.trim().toUpperCase() === selectedOption?.trim().toUpperCase()
    );

    const existingSub = await this.prisma.submission.findFirst({
      where: { attemptId, questionId },
    });

    let submission;
    if (existingSub) {
      submission = await this.prisma.submission.update({
        where: { id: existingSub.id },
        data: {
          selectedOption,
          isCorrect,
          timeTakenSec: (existingSub.timeTakenSec || 0) + (timeTakenSec || 0),
        },
      });
    } else {
      submission = await this.prisma.submission.create({
        data: {
          attemptId,
          questionId,
          selectedOption,
          isCorrect,
          timeTakenSec: timeTakenSec || 0,
        },
      });
    }

    return {
      success: true,
      message: 'Answer saved in real-time.',
      submissionId: submission.id,
      questionId,
      selectedOption,
    };
  }

  // ─── CHECK ATTEMPT LOCK / RESUME STATUS ────────────────────────────────────
  async checkAttemptStatus(attemptId: string) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { candidate: true },
    });
    if (!attempt) throw new NotFoundException('Attempt not found.');

    const totalDurationSec = (attempt.durationMinsSnapshot || EXAM_DURATION_MINS) * 60;
    const now = Date.now();
    let currentSessionElapsed = 0;
    if (attempt.status === 'IN_PROGRESS' && attempt.startedAt) {
      currentSessionElapsed = Math.floor((now - new Date(attempt.startedAt).getTime()) / 1000);
    }
    const totalSpent = (attempt.totalTimeSpentSec || 0) + Math.max(0, currentSessionElapsed);
    const remainingTimeSec = Math.max(0, totalDurationSec - totalSpent);

    return {
      success: true,
      attemptId: attempt.id,
      status: attempt.status,
      warningCount: attempt.warningCount,
      maxProctorWarnings: attempt.maxProctorWarningsSnapshot,
      lockReason: attempt.lockReason,
      remainingTimeSec,
      isUnlocked: attempt.status === 'IN_PROGRESS',
    };
  }

  // ─── PROCTORING ────────────────────────────────────────────────────────────
  async logProctoringEvent(attemptId: string, eventType: string, details?: string) {
    const attempt = await this.prisma.examAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) throw new NotFoundException('Exam attempt not found.');

    // Log the proctoring event
    await this.prisma.proctoringLog.create({
      data: { attemptId: attempt.id, eventType, details },
    });

    const newWarningCount = attempt.warningCount + 1;
    const isDisqualified = newWarningCount >= attempt.maxProctorWarningsSnapshot;
    const lockReason = isDisqualified
      ? `Locked after ${newWarningCount} proctoring violations. Last event: ${eventType}`
      : undefined;

    let sessionSeconds = 0;
    if (attempt.startedAt) {
      sessionSeconds = Math.max(0, Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000));
    }
    const newTotalSpent = (attempt.totalTimeSpentSec || 0) + sessionSeconds;

    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        warningCount: newWarningCount,
        ...(isDisqualified && {
          status: 'LOCKED',
          submittedAt: null,
          lockedAt: new Date(),
          lockReason,
          totalTimeSpentSec: newTotalSpent,
        }),
      },
    });

    if (isDisqualified) {
      // Lock candidate status to LOCKED
      await this.prisma.candidate.update({
        where: { id: attempt.candidateId },
        data: { status: 'LOCKED' },
      });

      // Fire LOCKED status webhook to Headstart CRM (API 4) if enabled
      await this.headstartWebhook.sendAssessmentStatus(attempt.id, 'LOCKED').catch(() => {});
    }

    return {
      warningCount: updatedAttempt.warningCount,
      maxProctorWarnings: updatedAttempt.maxProctorWarningsSnapshot,
      disqualified: isDisqualified,
      lockedAt: updatedAttempt.lockedAt,
      lockReason: updatedAttempt.lockReason,
      message: isDisqualified
        ? `🔒 Exam LOCKED: Maximum ${updatedAttempt.maxProctorWarningsSnapshot} proctoring warnings reached. Contact your HR Administrator to unlock.`
        : `Warning ${updatedAttempt.warningCount}/${updatedAttempt.maxProctorWarningsSnapshot}: Proctoring violation logged.`,
    };
  }

  // ─── CANDIDATE MANAGEMENT ──────────────────────────────────────────────────

  // Unlock candidate (Admin action) — keeps warning history, only resets lock
  async unlockCandidate(id: string, adminId: string, adminName: string, reason?: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: { attempts: { orderBy: { startedAt: 'desc' }, take: 1 } },
    });
    if (!candidate) throw new NotFoundException('Candidate not found.');

    const latestAttempt = candidate.attempts[0];
    if (!latestAttempt) throw new BadRequestException('No exam attempt found for this candidate.');

    // Resolve valid Admin ID for foreign key constraint
    const adminRecord =
      (await this.prisma.admin.findFirst({
        where: { OR: [{ id: adminId }, { username: adminName }] },
      })) || (await this.prisma.admin.findFirst());

    const resolvedAdminId = adminRecord ? adminRecord.id : null;

    // Unlock the attempt — reset current cycle warningCount to 0 (lifetime history preserved in proctoringLogs)
    // startedAt reset to now() so new active timer session starts fresh against remaining duration
    await this.prisma.examAttempt.update({
      where: { id: latestAttempt.id },
      data: {
        status: 'IN_PROGRESS',
        warningCount: 0,
        startedAt: new Date(),
        submittedAt: null,
        unlockedAt: new Date(),
        unlockedByAdminId: resolvedAdminId || adminId,
        unlockedByAdminName: adminName,
      },
    });

    // Create audit log if valid admin found
    if (resolvedAdminId) {
      await this.prisma.adminActionLog
        .create({
          data: {
            attemptId: latestAttempt.id,
            adminId: resolvedAdminId,
            action: 'UNLOCK',
            reason: reason || 'Admin unlocked candidate',
          },
        })
        .catch((e) => this.logger.warn(`Failed to create AdminActionLog: ${e.message}`));
    }

    // Update candidate status back to IN_PROGRESS
    const updatedCandidate = await this.prisma.candidate.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
      include: { assessment: true },
    });

    // Fire UNLOCKED webhook to Headstart CRM
    await this.headstartWebhook.sendAssessmentStatus(latestAttempt.id, 'UNLOCKED').catch(() => {});

    return {
      success: true,
      message: `Candidate '${candidate.name}' has been unlocked. Previous warnings kept in audit log.`,
      candidate: updatedCandidate,
      unlockedAt: new Date(),
      unlockedBy: adminName,
      reason: reason || 'Admin manual unlock',
    };
  }

  // Simple reset (full reset — clears warnings too)
  async resetCandidate(id: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new NotFoundException('Candidate not found.');

    return this.prisma.candidate.update({
      where: { id },
      data: { status: 'REGISTERED' },
      include: { assessment: true },
    });
  }

  async deleteCandidate(id: string) {
    return this.prisma.candidate.delete({ where: { id } });
  }

  // ─── ASSESSMENT SESSION MANAGEMENT ────────────────────────────────────────
  async getAllAssessments() {
    const assessments = await this.prisma.assessment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { candidates: true } },
      },
    });

    const frontendBaseUrl = process.env.CANDIDATE_PORTAL_URL || process.env.FRONTEND_CANDIDATE_URL || 'http://localhost:3000';

    return assessments.map((ass) => {
      // Auto-compute status based on activeFrom/activeUntil
      const now = new Date();
      let computedStatus = ass.status;
      if (ass.activeFrom && now < new Date(ass.activeFrom)) {
        computedStatus = 'UPCOMING';
      } else if (ass.activeUntil && now > new Date(ass.activeUntil)) {
        computedStatus = 'EXPIRED';
      }

      return {
        id: ass.id,
        name: ass.name,
        slug: ass.slug,
        description: ass.description,
        passingPercentage: ass.passingPercentage,
        maxProctorWarnings: ass.maxProctorWarnings,
        status: computedStatus,
        activeFrom: ass.activeFrom,
        activeUntil: ass.activeUntil,
        createdAt: ass.createdAt,
        totalCandidates: ass._count.candidates,
        durationMins: ass.durationMins || EXAM_DURATION_MINS,
        totalQuestions: TOTAL_QUESTIONS,
        uniqueCandidateLink: `${frontendBaseUrl}/${ass.slug || ass.id}`,
      };
    });
  }

  async getAssessmentByIdentifier(identifier: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment session '${identifier}' not found.`);
    }

    const now = new Date();

    // Check if session hasn't started yet (activeFrom in the future)
    const isNotStarted = !!(assessment.activeFrom && now < new Date(assessment.activeFrom));

    // Check if session has expired (activeUntil in the past) — computed at runtime, NOT persisted to DB
    let isExpired = assessment.status === 'INACTIVE';
    if (!isNotStarted && assessment.activeUntil && now > new Date(assessment.activeUntil)) {
      isExpired = true;
    }

    const frontendBaseUrl = process.env.CANDIDATE_PORTAL_URL || process.env.FRONTEND_CANDIDATE_URL || 'http://localhost:3000';

    return {
      id: assessment.id,
      name: assessment.name,
      slug: assessment.slug,
      description: assessment.description,
      status: isExpired ? 'EXPIRED' : (isNotStarted ? 'UPCOMING' : 'ACTIVE'),
      activeFrom: assessment.activeFrom,
      activeUntil: assessment.activeUntil,
      durationMins: assessment.durationMins || EXAM_DURATION_MINS,
      totalQuestions: TOTAL_QUESTIONS,
      isExpired,
      isNotStarted,
      uniqueCandidateLink: `${frontendBaseUrl}/${assessment.slug || assessment.id}`,
    };
  }

  async createOrUpdateAssessment(data: {
    id?: string;
    name: string;
    slug?: string;
    description?: string;
    durationMins?: number;
    activeFrom?: string;       // ISO datetime string — when link becomes accessible
    activeUntil?: string;      // ISO datetime string — when link expires
    activeHours?: number;      // convenience: set activeUntil = now + activeHours
    passingPercentage?: number;
    maxProctorWarnings?: number;
    status?: string;
  }) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new NotFoundException('Default tenant not found.');

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Resolve activeFrom
    const activeFrom = data.activeFrom ? new Date(data.activeFrom) : null;

    // Resolve activeUntil — prefer explicit ISO, else compute from activeHours
    let activeUntil: Date | null = null;
    if (data.activeUntil) {
      activeUntil = new Date(data.activeUntil);
    } else if (data.activeHours && data.activeHours > 0) {
      activeUntil = new Date(Date.now() + data.activeHours * 3600 * 1000);
    }

    const payload: any = {
      name: data.name,
      slug,
      description: data.description,
      durationMins: data.durationMins ? Number(data.durationMins) : 45,
      passingPercentage: data.passingPercentage ? Number(data.passingPercentage) : 50.0,
      maxProctorWarnings: data.maxProctorWarnings ? Number(data.maxProctorWarnings) : 3,
      status: data.status || 'ACTIVE',
      ...(activeFrom !== null && { activeFrom }),
      ...(activeUntil !== null && { activeUntil }),
    };

    if (data.id) {
      return this.prisma.assessment.update({ where: { id: data.id }, data: payload });
    }

    return this.prisma.assessment.create({
      data: {
        tenantId: tenant.id,
        ...payload,
        description: payload.description || 'Assessment Session',
      },
    });
  }

  async deleteAssessment(id: string) {
    return this.prisma.assessment.delete({ where: { id: id } });
  }

  // ─── CANDIDATE DIAGNOSTIC REPORT CARD ENGINE ──────────────────────────────
  async getCandidateReport(candidateId: string) {
    const candidate: any = await (this.prisma.candidate as any).findUnique({
      where: { id: candidateId },
      include: {
        assessment: true,
        attempts: {
          orderBy: { startedAt: 'desc' },
          include: {
            submissions: {
              include: { question: true },
            },
            proctoringLogs: {
              orderBy: { timestamp: 'asc' },
            },
            adminActions: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with ID '${candidateId}' not found.`);
    }

    const latestAttempt = candidate.attempts ? candidate.attempts[0] : null;
    if (!latestAttempt) {
      throw new NotFoundException(`No exam attempt records found for candidate '${candidate.name}'.`);
    }

    // Determine status badge
    let isPassed = latestAttempt.isPassed;
    let resultStatus = 'NOT QUALIFIED';
    if (latestAttempt.status === 'LOCKED') {
      resultStatus = 'LOCKED';
    } else if (latestAttempt.status === 'DISQUALIFIED') {
      resultStatus = 'DISQUALIFIED';
    } else if (isPassed || (latestAttempt.percentage >= (latestAttempt.passingPercentageSnapshot || 50))) {
      resultStatus = 'QUALIFIED';
      isPassed = true;
    }

    // Time calculation
    const startTime = latestAttempt.startedAt ? new Date(latestAttempt.startedAt).getTime() : Date.now();
    const endTime = latestAttempt.submittedAt
      ? new Date(latestAttempt.submittedAt).getTime()
      : latestAttempt.lockedAt
      ? new Date(latestAttempt.lockedAt).getTime()
      : Date.now();

    const durationSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const durationFormatted = `${mins} mins ${secs} secs`;

    // Pre-initialize exact 6 official Niva Bupa sections
    const officialSections = [
      { sectionOrder: 1, name: 'Communication & Customer Handling', questionRange: 'Q1–10', minQ: 1, maxQ: 10, total: 0, correct: 0, marks: 0 },
      { sectionOrder: 2, name: 'Advanced English & Comprehension', questionRange: 'Q11–20', minQ: 11, maxQ: 20, total: 0, correct: 0, marks: 0 },
      { sectionOrder: 3, name: 'Mental Ability & Reasoning', questionRange: 'Q21–30', minQ: 21, maxQ: 30, total: 0, correct: 0, marks: 0 },
      { sectionOrder: 4, name: 'Numerical & Mathematical Reasoning', questionRange: 'Q31–40', minQ: 31, maxQ: 40, total: 0, correct: 0, marks: 0 },
      { sectionOrder: 5, name: 'Banking & Financial Awareness', questionRange: 'Q41–50', minQ: 41, maxQ: 50, total: 0, correct: 0, marks: 0 },
      { sectionOrder: 6, name: 'Sales Orientation & Situational Judgement', questionRange: 'Q51–60', minQ: 51, maxQ: 60, total: 0, correct: 0, marks: 0 },
    ];

    let calculatedObtainedMarks = 0;
    let calculatedTotalPossible = 0;

    const responses: Array<{
      questionOrder: number;
      sectionName: string;
      questionText: string;
      candidateOption: string | null;
      correctOption: string;
      isCorrect: boolean;
      marks: number;
    }> = [];

    // Sort submissions by question sectionOrder then question id/order
    const submissions = latestAttempt.submissions || [];
    const sortedSubmissions = submissions.sort((a: any, b: any) => {
      const qNumA = parseInt(a.question.id.replace(/\D/g, '')) || 0;
      const qNumB = parseInt(b.question.id.replace(/\D/g, '')) || 0;
      if ((a.question.sectionOrder || 0) !== (b.question.sectionOrder || 0)) {
        return (a.question.sectionOrder || 0) - (b.question.sectionOrder || 0);
      }
      return qNumA - qNumB;
    });

    sortedSubmissions.forEach((sub: any, idx: number) => {
      const qOrder = idx + 1;
      const questionMarks = sub.question.marks || 1;
      calculatedTotalPossible += questionMarks;

      // Find matching official section by question number range
      const targetSec = officialSections.find(s => qOrder >= s.minQ && qOrder <= s.maxQ) || officialSections[Math.min(5, Math.floor(idx / 10))];
      targetSec.total += 1;
      targetSec.marks += questionMarks;

      if (sub.isCorrect) {
        targetSec.correct += 1;
        calculatedObtainedMarks += questionMarks;
      }

      responses.push({
        questionOrder: qOrder,
        sectionName: targetSec.name,
        questionText: sub.question.question,
        candidateOption: sub.selectedOption,
        correctOption: sub.question.correctAnswer,
        isCorrect: sub.isCorrect,
        marks: questionMarks,
      });
    });

    // Structure sections array strictly into 6 objects
    const sections = officialSections.map((sec) => ({
      sectionOrder: sec.sectionOrder,
      name: sec.name,
      questionRange: sec.questionRange,
      score: sec.correct,
      totalMarks: sec.total,
      percentage: sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0,
    }));

    // Proctoring audit timeline
    const proctoringLogs = latestAttempt.proctoringLogs || [];
    const proctoringEvents = proctoringLogs.map((log: any) => ({
      id: log.id,
      eventType: log.eventType,
      details: log.details,
      timestamp: log.timestamp || log.createdAt,
    }));

    // Admin Remarks / Audit logs
    const adminActions = latestAttempt.adminActions || [];
    const remarks = adminActions.map((action: any) => ({
      id: action.id,
      adminId: action.adminId,
      action: action.action,
      reason: action.reason,
      createdAt: action.createdAt,
    }));

    const assessmentObj = candidate.assessment || {};

    return {
      success: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        applicationId: candidate.applicationId || candidate.referenceId,
        crmCandidateId: candidate.crmCandidateId,
        status: candidate.status,
      },
      assessment: {
        id: assessmentObj.id || candidate.assessmentId,
        title: assessmentObj.name || 'Assessment Session',
        slug: assessmentObj.slug || '',
        durationMins: latestAttempt.durationMinsSnapshot || assessmentObj.durationMins || 45,
        passingPercentage: latestAttempt.passingPercentageSnapshot || assessmentObj.passingPercentage || 50,
      },
      result: {
        status: resultStatus,
        isPassed,
        score: latestAttempt.score || calculatedObtainedMarks,
        totalMarks: latestAttempt.totalPossibleScore || calculatedTotalPossible || 60,
        percentage: latestAttempt.percentage || (calculatedTotalPossible > 0 ? Math.round((calculatedObtainedMarks / calculatedTotalPossible) * 100) : 0),
      },
      timing: {
        startedAt: latestAttempt.startedAt,
        submittedAt: latestAttempt.submittedAt || latestAttempt.lockedAt,
        durationSeconds,
        durationFormatted,
      },
      sections,
      responses,
      proctoring: {
        warningCount: latestAttempt.warningCount,
        maxWarnings: latestAttempt.maxProctorWarningsSnapshot,
        lockReason: latestAttempt.lockReason,
        events: proctoringEvents,
      },
      remarks,
    };
  }

  async saveCandidateRemarks(candidateId: string, adminId: string, remarkText: string) {
    const candidate: any = await (this.prisma.candidate as any).findUnique({
      where: { id: candidateId },
      include: { attempts: { orderBy: { startedAt: 'desc' } } },
    });

    if (!candidate) throw new NotFoundException('Candidate not found.');

    const latestAttempt = candidate.attempts[0];
    if (!latestAttempt) throw new NotFoundException('No attempt found.');

    const admin = (await this.prisma.admin.findFirst()) || { id: adminId };

    const actionLog = await this.prisma.adminActionLog.create({
      data: {
        attemptId: latestAttempt.id,
        adminId: admin.id,
        action: 'REMARK',
        reason: remarkText,
      },
    });

    return { success: true, remark: actionLog };
  }
}
