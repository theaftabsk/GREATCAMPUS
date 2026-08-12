import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HeadstartClientService } from '../integration/headstart/headstart-client.service';
import { HeadstartWebhookService } from '../integration/headstart/headstart-webhook.service';

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(
    private prisma: PrismaService,
    private headstartClient: HeadstartClientService,
    private headstartWebhook: HeadstartWebhookService,
  ) {}

  async getCandidates(assessmentId?: string) {
    const whereClause: any = {};
    if (assessmentId) whereClause.assessmentId = assessmentId;

    const candidates = await this.prisma.candidate.findMany({
      where: whereClause,
      include: {
        assessment: {
          include: {
            subjects: {
              include: {
                sections: true,
              },
            },
          },
        },
        attempts: {
          orderBy: { startedAt: 'desc' },
          include: {
            attemptQuestions: {
              include: {
                question: {
                  include: {
                    section: {
                      include: {
                        subject: true,
                      },
                    },
                  },
                },
              },
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
      let subjectBreakdown: Record<string, { subjectName: string; correct: number; total: number; percentage: number }> = {};
      let sectionBreakdown: Record<string, { sectionName: string; subjectName: string; correct: number; total: number }> = {};
      let questionAudit: any[] = [];

      if (latestAttempt) {
        // Build subject and section performance breakdown
        for (const aq of latestAttempt.attemptQuestions) {
          const subName = aq.question.section.subject.name;
          const secName = aq.question.section.name;
          const secKey = `${subName}___${secName}`;

          if (!subjectBreakdown[subName]) {
            subjectBreakdown[subName] = { subjectName: subName, correct: 0, total: 0, percentage: 0 };
          }
          if (!sectionBreakdown[secKey]) {
            sectionBreakdown[secKey] = { sectionName: secName, subjectName: subName, correct: 0, total: 0 };
          }

          subjectBreakdown[subName].total += 1;
          sectionBreakdown[secKey].total += 1;

          const submission = latestAttempt.submissions.find((s) => s.questionId === aq.questionId);
          if (submission && submission.isCorrect) {
            subjectBreakdown[subName].correct += 1;
            sectionBreakdown[secKey].correct += 1;
          }
        }

        Object.keys(subjectBreakdown).forEach((k) => {
          const item = subjectBreakdown[k];
          item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
        });

        questionAudit = latestAttempt.attemptQuestions.map((aq) => {
          const q = aq.question;
          const sub = latestAttempt.submissions.find((s) => s.questionId === q.id);
          const selected = sub?.selectedOption || null;
          const isCorrect = sub?.isCorrect || false;
          return {
            questionOrder: aq.questionOrder,
            questionText: q.question,
            subjectName: q.section.subject.name,
            sectionName: q.section.name,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            selectedOption: selected,
            correctAnswer: q.correctAnswer,
            isCorrect,
            marks: aq.marks,
          };
        });
      }

      return {
        id: cand.id,
        name: cand.name,
        email: cand.email,
        phone: cand.phone,
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
              durationMins: latestAttempt.durationMinsSnapshot,
              subjectBreakdown: Object.values(subjectBreakdown),
              sectionBreakdown: Object.values(sectionBreakdown),
              questionAudit: questionAudit || [],
              proctoringLogs: latestAttempt.proctoringLogs,
            }
          : null,
      };
    });
  }

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

    // Check if candidate with referenceId or email or applicationId exists
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
      // Update assigned assessment if re-registering
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

  /**
   * Verified Exam Entrance Flow (Headstart CRM API 1 + API 2 + API 4 Webhook)
   */
  async verifyAndStartExam(data: {
    applicationId: string;
    assessmentId: string;
    name?: string;
    email?: string;
    phone?: string;
  }) {
    this.logger.log(`Verifying candidate exam start for Application ID: ${data.applicationId}, Assessment: ${data.assessmentId}`);

    // Step 1: Call CRM API 1 to verify candidate details
    const crmDetails = await this.headstartClient.verifyCandidate(data.applicationId);
    if (!crmDetails.success) {
      throw new BadRequestException(crmDetails.message || 'Failed to verify candidate with Headstart CRM.');
    }

    // Step 2: Call CRM API 2 to verify candidate assignment
    const crmAssignment = await this.headstartClient.verifyAssignment(data.applicationId, data.assessmentId);
    if (!crmAssignment.assigned) {
      throw new BadRequestException('Candidate is NOT assigned to this assessment in Headstart CRM.');
    }

    // Step 3: Register / Find Candidate in local DB
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
      candidate = await this.prisma.candidate.create({
        data: {
          name,
          email,
          phone,
          applicationId: data.applicationId,
          crmCandidateId: crmDetails.crmCandidateId || null,
          referenceId: data.applicationId,
          assessmentId: data.assessmentId,
        },
      });
    } else {
      candidate = await this.prisma.candidate.update({
        where: { id: candidate.id },
        data: {
          assessmentId: data.assessmentId,
          name,
          email,
          phone,
          crmCandidateId: crmDetails.crmCandidateId || candidate.crmCandidateId,
        },
      });
    }

    // Step 4: Initialize Exam Session
    const sessionData = await this.startExamSession(candidate.id);

    // Step 5: Fire API 4 Status Webhook (Status = Started)
    if (sessionData && sessionData.attemptId) {
      await this.headstartWebhook.sendAssessmentStatus(sessionData.attemptId, 'Started');
    }

    return sessionData;
  }

  // --- START EXAM SESSION & SAMPLING ---
  async startExamSession(candidateIdentifier: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { OR: [{ id: candidateIdentifier }, { referenceId: candidateIdentifier }] },
      include: {
        assessment: {
          include: {
            subjects: {
              orderBy: { displayOrder: 'asc' },
              include: {
                sections: {
                  orderBy: { displayOrder: 'asc' },
                  include: {
                    questions: { where: { status: 'ACTIVE' } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundException('Candidate not found.');
    }

    // RULE 3: Active Attempt Check (status = "IN_PROGRESS")
    const activeAttempt = await this.prisma.examAttempt.findFirst({
      where: {
        candidateId: candidate.id,
        status: 'IN_PROGRESS',
      },
      include: {
        attemptQuestions: {
          orderBy: { questionOrder: 'asc' },
          include: {
            question: {
              include: {
                section: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
        },
        submissions: true,
      },
    });

    if (activeAttempt) {
      // Return existing active attempt with locked questions
      return {
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          referenceId: candidate.referenceId,
        },
        attemptId: activeAttempt.id,
        assessmentName: candidate.assessment.name,
        durationMins: activeAttempt.durationMinsSnapshot,
        maxProctorWarnings: activeAttempt.maxProctorWarningsSnapshot,
        warningCount: activeAttempt.warningCount,
        questions: activeAttempt.attemptQuestions.map((aq) => ({
          attemptQuestionId: aq.id,
          id: aq.question.id,
          subjectId: aq.subjectId,
          subjectName: aq.question.section.subject.name,
          sectionId: aq.sectionId,
          sectionName: aq.question.section.name,
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

    // Simplified Flat Attempt Creation (45 Mins, 60 Questions Direct from DB)
    const attempt = await this.prisma.examAttempt.create({
      data: {
        candidateId: candidate.id,
        status: 'IN_PROGRESS',
        durationMinsSnapshot: 45,
        passingPercentageSnapshot: candidate.assessment.passingPercentage || 50.0,
        maxProctorWarningsSnapshot: candidate.assessment.maxProctorWarnings || 3,
        startedAt: new Date(),
      },
    });

    // Fetch questions directly from DB for this assessment
    const allDbQuestions = await this.prisma.question.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'asc' },
    });

    const selectedQuestionRecords: Array<{
      attemptId: string;
      questionId: string;
      subjectId: string;
      sectionId: string;
      questionOrder: number;
      marks: number;
    }> = [];

    let order = 1;
    for (const q of allDbQuestions) {
      selectedQuestionRecords.push({
        attemptId: attempt.id,
        questionId: q.id,
        subjectId: q.sectionId,
        sectionId: q.sectionId,
        questionOrder: order++,
        marks: q.marks || 1.0,
      });
    }

    // Batch insert AttemptQuestion records
    await this.prisma.attemptQuestion.createMany({
      data: selectedQuestionRecords,
    });

    // Update Candidate status to IN_PROGRESS
    await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: { status: 'IN_PROGRESS' },
    });

    // Retrieve attempt with relational questions
    const createdAttempt = await this.prisma.examAttempt.findUnique({
      where: { id: attempt.id },
      include: {
        attemptQuestions: {
          orderBy: { questionOrder: 'asc' },
          include: {
            question: {
              include: {
                section: {
                  include: {
                    subject: true,
                  },
                },
              },
            },
          },
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
        subjectId: aq.subjectId,
        subjectName: aq.question.section.subject.name,
        sectionId: aq.sectionId,
        sectionName: aq.question.section.name,
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

  // --- SUBMIT EXAM ---
  async submitExam(
    attemptId: string,
    answers: Record<string, any>
  ) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        attemptQuestions: {
          include: {
            question: true,
          },
        },
        candidate: true,
      },
    });

    if (!attempt) throw new NotFoundException('Exam attempt not found.');
    if (attempt.status === 'COMPLETED' || attempt.status === 'DISQUALIFIED') {
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

    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        submittedAt: new Date(),
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

    // Fire Headstart OUT Webhooks (API 4 Status = Completed, API 5 Result, API 6 Report Card)
    try {
      await this.headstartWebhook.sendAssessmentStatus(attempt.id, 'Completed');
      await this.headstartWebhook.sendAssessmentResultAndReportCard(attempt.id);
    } catch (err) {
      this.logger.error(`Error firing post-submission webhooks: ${err.message}`);
    }

    return updatedAttempt;
  }

  // --- PROCTORING VIOLATION LOGGING ---
  async logProctoringEvent(attemptId: string, eventType: string, details?: string) {
    const attempt = await this.prisma.examAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) throw new NotFoundException('Exam attempt not found.');

    await this.prisma.proctoringLog.create({
      data: {
        attemptId: attempt.id,
        eventType,
        details,
      },
    });

    const newWarningCount = attempt.warningCount + 1;

    // RULE 6: Strict Warning Threshold (Max warnings reached -> DISQUALIFIED & Auto-submit)
    const isDisqualified = newWarningCount >= attempt.maxProctorWarningsSnapshot;

    const updatedAttempt = await this.prisma.examAttempt.update({
      where: { id: attempt.id },
      data: {
        warningCount: newWarningCount,
        ...(isDisqualified && {
          status: 'DISQUALIFIED',
          submittedAt: new Date(),
        }),
      },
    });

    if (isDisqualified) {
      await this.prisma.candidate.update({
        where: { id: attempt.candidateId },
        data: { status: 'DISQUALIFIED' },
      });
    }

    return {
      warningCount: updatedAttempt.warningCount,
      maxProctorWarnings: updatedAttempt.maxProctorWarningsSnapshot,
      disqualified: isDisqualified,
      message: isDisqualified
        ? 'Maximum proctoring warnings reached. Exam has been auto-submitted and marked as DISQUALIFIED.'
        : `Warning ${updatedAttempt.warningCount}/${updatedAttempt.maxProctorWarningsSnapshot}: Proctoring violation logged.`,
    };
  }

  async resetCandidate(id: string) {
    const candidate = await this.prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new NotFoundException('Candidate not found.');

    // Reset candidate status so candidate can re-enter session & start a fresh attempt
    // Historical attempt records (ExamAttempt, Submission, ProctoringLog) remain 100% intact in DB
    return this.prisma.candidate.update({
      where: { id },
      data: {
        status: 'REGISTERED',
      },
      include: { assessment: true },
    });
  }

  async deleteCandidate(id: string) {
    return this.prisma.candidate.delete({ where: { id } });
  }

  // --- ASSESSMENT MANAGEMENT & UNIQUE LINKS ---
  async getAllAssessments() {
    const assessments = await this.prisma.assessment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { candidates: true },
        },
      },
    });

    const frontendBaseUrl = process.env.FRONTEND_CANDIDATE_URL || 'https://greatcampus-1.onrender.com';

    return assessments.map((ass) => ({
      ...ass,
      totalCandidates: ass._count.candidates,
      uniqueCandidateLink: `${frontendBaseUrl}/exam?assessment=${ass.slug || ass.id}`,
    }));
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

    // Check if session link has expired
    let isExpired = assessment.status === 'EXPIRED' || assessment.status === 'INACTIVE';
    if (assessment.activeUntil && new Date() > new Date(assessment.activeUntil)) {
      isExpired = true;
      if (assessment.status !== 'EXPIRED') {
        await this.prisma.assessment.update({
          where: { id: assessment.id },
          data: { status: 'EXPIRED' },
        });
      }
    }

    const frontendBaseUrl = process.env.FRONTEND_CANDIDATE_URL || 'https://greatcampus-1.onrender.com';
    return {
      ...assessment,
      isExpired,
      uniqueCandidateLink: `${frontendBaseUrl}/exam?assessment=${assessment.slug || assessment.id}`,
    };
  }

  async createOrUpdateAssessment(data: {
    id?: string;
    name: string;
    slug?: string;
    description?: string;
    durationMins?: number;
    activeHours?: number;
    passingPercentage?: number;
    maxProctorWarnings?: number;
    status?: string;
  }) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new NotFoundException('Default tenant not found.');

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const activeUntil = data.activeHours && data.activeHours > 0
      ? new Date(Date.now() + data.activeHours * 3600 * 1000)
      : null;

    if (data.id) {
      return this.prisma.assessment.update({
        where: { id: data.id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          durationMins: 45, // Fixed 45 mins exam duration
          passingPercentage: data.passingPercentage || 50.0,
          maxProctorWarnings: data.maxProctorWarnings || 3,
          status: data.status || 'ACTIVE',
          ...(activeUntil && { activeUntil }),
        },
      });
    }

    return this.prisma.assessment.create({
      data: {
        tenantId: tenant.id,
        name: data.name,
        slug,
        description: data.description || 'Niva Bupa Health Insurance Assessment Session',
        durationMins: 45, // Fixed 45 mins exam duration
        passingPercentage: data.passingPercentage || 50.0,
        maxProctorWarnings: data.maxProctorWarnings || 3,
        status: data.status || 'ACTIVE',
        activeUntil,
      },
    });
  }

  async deleteAssessment(id: string) {
    return this.prisma.assessment.delete({ where: { id } });
  }
}

