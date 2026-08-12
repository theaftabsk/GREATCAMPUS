import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Fixed constants — cannot be changed by Admin
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

    const frontendBaseUrl = process.env.FRONTEND_CANDIDATE_URL || 'https://greatcampus-1.onrender.com';
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
        durationMins: EXAM_DURATION_MINS,
        totalQuestions: TOTAL_QUESTIONS,
        uniqueCandidateLink: `${frontendBaseUrl}/exam?assessment=${ass.slug || ass.id}`,
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

    const questionCount = await this.prisma.question.count({ where: { status: 'ACTIVE' } });
    const frontendBaseUrl = process.env.FRONTEND_CANDIDATE_URL || 'https://greatcampus-1.onrender.com';

    return {
      ...assessment,
      durationMins: EXAM_DURATION_MINS,
      totalQuestions: TOTAL_QUESTIONS,
      activeQuestions: questionCount,
      uniqueCandidateLink: `${frontendBaseUrl}/exam?assessment=${assessment.slug || assessment.id}`,
    };
  }

  async createAssessment(data: {
    name: string;
    description?: string;
    activeFrom?: string;
    activeUntil?: string;
    passingPercentage?: number;
    maxProctorWarnings?: number;
    status?: string;
  }) {
    const tenant = await this.getOrCreateTenant();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    return this.prisma.assessment.create({
      data: {
        tenantId: tenant.id,
        name: data.name,
        slug,
        description: data.description || '',
        passingPercentage: data.passingPercentage ?? 50,
        maxProctorWarnings: data.maxProctorWarnings ?? 3,
        status: data.status || 'ACTIVE',
        activeFrom: data.activeFrom ? new Date(data.activeFrom) : null,
        activeUntil: data.activeUntil ? new Date(data.activeUntil) : null,
      },
    });
  }

  async updateAssessment(
    id: string,
    data: {
      name?: string;
      description?: string;
      activeFrom?: string;
      activeUntil?: string;
      passingPercentage?: number;
      maxProctorWarnings?: number;
      status?: string;
    }
  ) {
    return this.prisma.assessment.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.passingPercentage !== undefined && { passingPercentage: data.passingPercentage }),
        ...(data.maxProctorWarnings !== undefined && { maxProctorWarnings: data.maxProctorWarnings }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.activeFrom !== undefined && { activeFrom: data.activeFrom ? new Date(data.activeFrom) : null }),
        ...(data.activeUntil !== undefined && { activeUntil: data.activeUntil ? new Date(data.activeUntil) : null }),
      },
    });
  }

  async deleteAssessment(id: string) {
    return this.prisma.assessment.delete({ where: { id } });
  }
}
