import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

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

      if (latestAttempt) {
        // Build subject and section performance breakdown
        for (const aq of latestAttempt.attemptQuestions) {
          const subName = aq.question.section.subject.name;
          const secName = aq.question.section.name;

          if (!subjectBreakdown[subName]) {
            subjectBreakdown[subName] = { subjectName: subName, correct: 0, total: 0, percentage: 0 };
          }
          if (!sectionBreakdown[secName]) {
            sectionBreakdown[secName] = { sectionName: secName, subjectName: subName, correct: 0, total: 0 };
          }

          subjectBreakdown[subName].total += 1;
          sectionBreakdown[secName].total += 1;

          const submission = latestAttempt.submissions.find((s) => s.questionId === aq.questionId);
          if (submission && submission.isCorrect) {
            subjectBreakdown[subName].correct += 1;
            sectionBreakdown[secName].correct += 1;
          }
        }

        Object.keys(subjectBreakdown).forEach((k) => {
          const item = subjectBreakdown[k];
          item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
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
  }) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id: data.assessmentId } });
    if (!assessment) {
      throw new NotFoundException(`Assigned Assessment not found.`);
    }

    const refId = data.referenceId || `REF-${Date.now().toString().slice(-6)}`;

    // Check if candidate with referenceId or email exists
    const existing = await this.prisma.candidate.findFirst({
      where: { OR: [{ referenceId: refId }, { email: data.email }] },
    });

    if (existing) {
      // Update assigned assessment if re-registering
      return this.prisma.candidate.update({
        where: { id: existing.id },
        data: {
          assessmentId: data.assessmentId,
          name: data.name,
          phone: data.phone,
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
        assessmentId: data.assessmentId,
      },
      include: { assessment: true },
    });
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

    // RULE 5: Question Pool Validation BEFORE creating new attempt
    const validationErrors: Array<{ sectionName: string; required: number; available: number }> = [];
    for (const sub of candidate.assessment.subjects) {
      for (const sec of sub.sections) {
        if (sec.questions.length < sec.questionsToAsk) {
          validationErrors.push({
            sectionName: `${sub.name} ➔ ${sec.name}`,
            required: sec.questionsToAsk,
            available: sec.questions.length,
          });
        }
      }
    }

    if (validationErrors.length > 0) {
      const firstErr = validationErrors[0];
      throw new BadRequestException(
        `Insufficient questions in Section: ${firstErr.sectionName} (Required: ${firstErr.required}, Available: ${firstErr.available})`
      );
    }

    // RULE 4: Create New Attempt with Snapshots & Randomized Question Selection
    const attempt = await this.prisma.examAttempt.create({
      data: {
        candidateId: candidate.id,
        status: 'IN_PROGRESS',
        durationMinsSnapshot: candidate.assessment.durationMins,
        passingPercentageSnapshot: candidate.assessment.passingPercentage,
        maxProctorWarningsSnapshot: candidate.assessment.maxProctorWarnings,
        startedAt: new Date(),
      },
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
    for (const sub of candidate.assessment.subjects) {
      for (const sec of sub.sections) {
        // Shuffle section pool questions randomly
        const shuffled = [...sec.questions].sort(() => Math.random() - 0.5);
        const sampled = shuffled.slice(0, sec.questionsToAsk);

        for (const q of sampled) {
          selectedQuestionRecords.push({
            attemptId: attempt.id,
            questionId: q.id,
            subjectId: sub.id,
            sectionId: sec.id,
            questionOrder: order++,
            marks: q.marks,
          });
        }
      }
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
    answers: Record<string, { selectedOption: string | null; timeTakenSec: number }>
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

    for (const aq of attempt.attemptQuestions) {
      const q = aq.question;
      const selected = answers[q.id]?.selectedOption || null;
      const isCorrect = selected === q.correctAnswer;
      const timeTaken = answers[q.id]?.timeTakenSec || 0;

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

  async deleteCandidate(id: string) {
    return this.prisma.candidate.delete({ where: { id } });
  }
}
