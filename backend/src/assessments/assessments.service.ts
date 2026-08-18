import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const EXAM_DURATION_MINS = 45;
const TOTAL_QUESTIONS = 60;

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateTenant() {
    let tenant = await this.prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await this.prisma.tenant.create({
        data: { name: 'GREATCAMPUS', slug: 'greatcampus' },
      });
    }
    return tenant;
  }

  async getAssessments() {
    const assessments = await this.prisma.assessment.findMany({
      include: {
        _count: { select: { candidates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const frontendBaseUrl = process.env.CANDIDATE_PORTAL_URL || process.env.FRONTEND_CANDIDATE_URL || 'http://localhost:3002';
    const now = new Date();

    return assessments.map((ass) => {
      let computedStatus = ass.status;
      if (ass.status !== 'INACTIVE' && ass.status !== 'DRAFT') {
        if (ass.activeFrom && now < new Date(ass.activeFrom)) computedStatus = 'UPCOMING';
        else if (ass.activeUntil && now > new Date(ass.activeUntil)) computedStatus = 'EXPIRED';
      }

      return {
        id: ass.id,
        name: ass.name,
        slug: ass.slug,
        description: ass.description,
        status: computedStatus,
        activeFrom: ass.activeFrom,
        activeUntil: ass.activeUntil,
        passingPercentage: ass.passingPercentage,
        maxProctorWarnings: ass.maxProctorWarnings,
        createdAt: ass.createdAt,
        totalCandidates: ass._count.candidates,
        durationMins: ass.durationMins || EXAM_DURATION_MINS,
        totalQuestions: TOTAL_QUESTIONS,
        uniqueCandidateLink: `${frontendBaseUrl}/${ass.slug || ass.id}`,
      };
    });
  }

  async getAssessmentById(id: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        _count: { select: { candidates: true } },
      },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment not found`);
    }

    const frontendBaseUrl = process.env.FRONTEND_CANDIDATE_URL || 'https://greatcampus-1.onrender.com';

    return {
      ...assessment,
      durationMins: assessment.durationMins || EXAM_DURATION_MINS,
      totalQuestions: TOTAL_QUESTIONS,
      uniqueCandidateLink: `${frontendBaseUrl}/exam?assessment=${assessment.slug || assessment.id}`,
    };
  }

  async saveAssessment(data: {
    id?: string;
    name: string;
    slug?: string;
    description?: string;
    durationMins?: number;
    activeFrom?: string;
    activeUntil?: string;
    passingPercentage?: number;
    maxProctorWarnings?: number;
    status?: string;
  }) {
    const tenant = await this.getOrCreateTenant();
    const slug = data.slug || (data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4));

    const now = new Date();
    let finalActiveFrom = data.activeFrom ? new Date(data.activeFrom) : null;
    let finalActiveUntil = data.activeUntil ? new Date(data.activeUntil) : null;

    // On creation: default activeFrom to NOW, activeUntil to NOW + 24 Hours if not specified
    if (!data.id) {
      if (!finalActiveFrom) finalActiveFrom = now;
      if (!finalActiveUntil) finalActiveUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    // Validation Guard: If activating an expired session without a future activeUntil, throw error
    if (data.id && data.status === 'ACTIVE') {
      const existing = await this.prisma.assessment.findUnique({ where: { id: data.id } });
      if (existing) {
        const targetUntil = finalActiveUntil !== undefined ? finalActiveUntil : existing.activeUntil;
        if (targetUntil && now > targetUntil) {
          throw new Error('Cannot activate an expired assessment session. Please edit the session and set a future Until end date.');
        }
      }
    }

    const payload: any = {
      name: data.name,
      slug,
      description: data.description || '',
      durationMins: data.durationMins ? Number(data.durationMins) : 45,
      passingPercentage: data.passingPercentage !== undefined ? Number(data.passingPercentage) : 50,
      maxProctorWarnings: data.maxProctorWarnings !== undefined ? Number(data.maxProctorWarnings) : 3,
      status: data.status || 'ACTIVE',
      ...(finalActiveFrom !== undefined && { activeFrom: finalActiveFrom }),
      ...(finalActiveUntil !== undefined && { activeUntil: finalActiveUntil }),
    };

    if (data.id) {
      const updated = await this.prisma.assessment.update({
        where: { id: data.id },
        data: payload,
      });

      // Synchronize in-progress and locked attempts so candidate sessions immediately reflect new duration, passing percentage, and max warnings
      await this.prisma.examAttempt.updateMany({
        where: {
          candidate: { assessmentId: data.id },
          status: { in: ['IN_PROGRESS', 'LOCKED'] },
        },
        data: {
          durationMinsSnapshot: payload.durationMins,
          passingPercentageSnapshot: payload.passingPercentage,
          maxProctorWarningsSnapshot: payload.maxProctorWarnings,
        },
      });

      return updated;
    }

    return this.prisma.assessment.create({
      data: {
        tenantId: tenant.id,
        ...payload,
      },
    });
  }

  async deleteAssessment(id: string) {
    return this.prisma.assessment.delete({ where: { id } });
  }
}
