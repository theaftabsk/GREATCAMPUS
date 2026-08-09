import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
        subjects: {
          include: {
            sections: {
              include: {
                _count: { select: { questions: true } },
              },
            },
          },
        },
        _count: { select: { candidates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assessments.map((assessment) => {
      let totalSections = 0;
      let totalPoolQuestions = 0;
      let totalAttemptQuestions = 0;
      const validationErrors: Array<{ sectionName: string; required: number; available: number }> = [];

      for (const sub of assessment.subjects) {
        totalSections += sub.sections.length;
        for (const sec of sub.sections) {
          const count = sec._count.questions;
          totalPoolQuestions += count;
          totalAttemptQuestions += sec.questionsToAsk;
          if (count < sec.questionsToAsk) {
            validationErrors.push({
              sectionName: `${sub.name} ➔ ${sec.name}`,
              required: sec.questionsToAsk,
              available: count,
            });
          }
        }
      }

      return {
        ...assessment,
        stats: {
          subjectCount: assessment.subjects.length,
          sectionCount: totalSections,
          totalPoolQuestions,
          totalAttemptQuestions,
          isValid: validationErrors.length === 0,
          validationErrors,
        },
      };
    });
  }

  async getAssessmentById(id: string) {
    const assessment = await this.prisma.assessment.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        subjects: {
          orderBy: { displayOrder: 'asc' },
          include: {
            sections: {
              orderBy: { displayOrder: 'asc' },
              include: {
                questions: true,
                _count: { select: { questions: true } },
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment not found`);
    }

    // Pool Validation Check
    const validationErrors: Array<{ sectionId: string; sectionName: string; required: number; available: number }> = [];
    let totalAttemptQuestions = 0;
    let totalPoolQuestions = 0;

    for (const sub of assessment.subjects) {
      for (const sec of sub.sections) {
        const count = sec._count.questions;
        totalPoolQuestions += count;
        totalAttemptQuestions += sec.questionsToAsk;
        if (count < sec.questionsToAsk) {
          validationErrors.push({
            sectionId: sec.id,
            sectionName: `${sub.name} ➔ ${sec.name}`,
            required: sec.questionsToAsk,
            available: count,
          });
        }
      }
    }

    return {
      ...assessment,
      stats: {
        subjectCount: assessment.subjects.length,
        sectionCount: assessment.subjects.reduce((sum, s) => sum + s.sections.length, 0),
        totalPoolQuestions,
        totalAttemptQuestions,
        isValid: validationErrors.length === 0,
        validationErrors,
      },
    };
  }

  async createAssessment(data: {
    name: string;
    description?: string;
    durationMins?: number;
    passingPercentage?: number;
    maxProctorWarnings?: number;
  }) {
    const tenant = await this.getOrCreateTenant();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    // Deactivate all existing assessments so ONLY 1 SINGLE ACTIVE EXAM exists!
    await this.prisma.assessment.updateMany({
      where: { status: 'ACTIVE' },
      data: { status: 'ARCHIVED' },
    });

    return this.prisma.assessment.create({
      data: {
        tenantId: tenant.id,
        name: data.name,
        slug,
        description: data.description || '',
        durationMins: data.durationMins ?? 60,
        passingPercentage: data.passingPercentage ?? 50,
        maxProctorWarnings: data.maxProctorWarnings ?? 3,
        status: 'ACTIVE',
      },
    });
  }

  async updateAssessment(
    id: string,
    data: {
      name?: string;
      description?: string;
      durationMins?: number;
      passingPercentage?: number;
      maxProctorWarnings?: number;
      status?: string;
    }
  ) {
    if (data.status === 'ACTIVE') {
      // Deactivate all other assessments
      await this.prisma.assessment.updateMany({
        where: { id: { not: id } },
        data: { status: 'ARCHIVED' },
      });
    }

    return this.prisma.assessment.update({
      where: { id },
      data,
    });
  }

  async deleteAssessment(id: string) {
    return this.prisma.assessment.delete({ where: { id } });
  }

  // --- SUBJECT OPERATIONS ---
  async addSubject(assessmentId: string, name: string) {
    const count = await this.prisma.assessmentSubject.count({ where: { assessmentId } });
    return this.prisma.assessmentSubject.create({
      data: {
        assessmentId,
        name,
        displayOrder: count + 1,
      },
    });
  }

  async updateSubject(id: string, name: string) {
    return this.prisma.assessmentSubject.update({
      where: { id },
      data: { name },
    });
  }

  async deleteSubject(id: string) {
    return this.prisma.assessmentSubject.delete({ where: { id } });
  }

  // --- SECTION OPERATIONS ---
  async addSection(subjectId: string, name: string, questionsToAsk: number = 5) {
    const count = await this.prisma.subjectSection.count({ where: { subjectId } });
    return this.prisma.subjectSection.create({
      data: {
        subjectId,
        name,
        questionsToAsk,
        displayOrder: count + 1,
      },
    });
  }

  async updateSection(id: string, name?: string, questionsToAsk?: number) {
    return this.prisma.subjectSection.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(questionsToAsk !== undefined && { questionsToAsk }),
      },
    });
  }

  async deleteSection(id: string) {
    return this.prisma.subjectSection.delete({ where: { id } });
  }
}
