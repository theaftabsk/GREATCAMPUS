import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditsService } from '../credits/credits.service';

@Injectable()
export class SuperAdminService {
  private readonly logger = new Logger(SuperAdminService.name);

  constructor(
    private prisma: PrismaService,
    private creditsService: CreditsService,
  ) {}

  /**
   * Super Admin Login
   */
  async login(username: string, pass: string) {
    // Check for super admin credentials (or default super admin)
    const superAdminUser = process.env.SUPER_ADMIN_USER || 'superadmin';
    const superAdminPass = process.env.SUPER_ADMIN_PASS || 'SuperAdmin@2026';

    if (username === superAdminUser && pass === superAdminPass) {
      return {
        success: true,
        token: `super-admin-token-${Date.now()}`,
        user: {
          username: superAdminUser,
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
        },
      };
    }

    // Check in database Admin table for SUPER_ADMIN role
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (admin && admin.password === pass && admin.role === 'SUPER_ADMIN') {
      return {
        success: true,
        token: `super-admin-token-${admin.id}`,
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          role: admin.role,
        },
      };
    }

    throw new UnauthorizedException('Invalid Super Admin credentials.');
  }

  /**
   * Global Super Admin Dashboard
   */
  async getGlobalDashboard() {
    const tenants = await this.prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            assessments: true,
          },
        },
      },
    });

    const tenantStats = await Promise.all(
      tenants.map(async (t) => {
        return this.creditsService.getTenantStats(t.id);
      }),
    );

    const totalLimit = tenants.reduce((acc, t) => acc + t.creditLimit, 0);
    const totalUsed = tenants.reduce((acc, t) => acc + t.usedCredit, 0);
    const totalRemaining = Math.max(0, totalLimit - totalUsed);

    const totalAssessments = tenantStats.reduce((acc, s) => acc + s.metrics.totalAssessments, 0);
    const totalCandidates = tenantStats.reduce((acc, s) => acc + s.metrics.totalCandidates, 0);
    const totalAttempts = tenantStats.reduce((acc, s) => acc + s.metrics.examAttempts, 0);
    const totalCompleted = tenantStats.reduce((acc, s) => acc + s.metrics.completed, 0);
    const totalInProgress = tenantStats.reduce((acc, s) => acc + s.metrics.inProgress, 0);
    const totalNotStarted = tenantStats.reduce((acc, s) => acc + s.metrics.notStarted, 0);

    return {
      summary: {
        totalCreditLimit: totalLimit,
        totalUsedCredit: totalUsed,
        totalRemainingCredit: totalRemaining,
        totalTenants: tenants.length,
        totalAssessments,
        totalCandidates,
        totalAttempts,
        completed: totalCompleted,
        inProgress: totalInProgress,
        notStarted: totalNotStarted,
      },
      tenants: tenantStats,
    };
  }

  /**
   * Get all tenants with detailed metrics
   */
  async getAllTenants() {
    const tenants = await this.prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(tenants.map((t) => this.creditsService.getTenantStats(t.id)));
  }

  /**
   * Allocate Credits (+500, etc.)
   */
  async allocateCredits(tenantId: string, amount: number, adminName = 'Super Admin', notes?: string) {
    return this.creditsService.allocateCredits(tenantId, amount, adminName, notes);
  }

  /**
   * Adjust Limit with strict safety validation
   */
  async adjustLimit(tenantId: string, newLimit: number, adminName = 'Super Admin', reason?: string) {
    return this.creditsService.adjustCreditLimit(tenantId, newLimit, adminName, reason);
  }

  /**
   * Get Credit Ledger History
   */
  async getCreditHistory(tenantId: string, page = 1, limit = 50, type?: string) {
    return this.creditsService.getCreditHistory(tenantId, page, limit, type);
  }

  /**
   * Update Super Admin Credentials
   */
  async updateCredentials(data: {
    username: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const superAdminUser = process.env.SUPER_ADMIN_USER || 'superadmin';
    const superAdminPass = process.env.SUPER_ADMIN_PASS || 'SuperAdmin@2026';

    let admin = await this.prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (admin) {
      if (data.currentPassword && admin.password !== data.currentPassword && data.currentPassword !== superAdminPass) {
        throw new UnauthorizedException('Current password does not match.');
      }

      const updateData: any = {};
      if (data.username && data.username.trim() !== '') {
        updateData.username = data.username.trim();
      }
      if (data.newPassword && data.newPassword.trim() !== '') {
        updateData.password = data.newPassword.trim();
      }

      const updated = await this.prisma.admin.update({
        where: { id: admin.id },
        data: updateData,
      });

      return {
        success: true,
        message: 'Super Admin credentials updated successfully.',
        user: { username: updated.username, name: updated.name, role: updated.role },
      };
    } else {
      let tenant = await this.prisma.tenant.findFirst();
      if (!tenant) {
        tenant = await this.prisma.tenant.create({
          data: { name: 'Niva Bupa Health Insurance', slug: 'niva-bupa' },
        });
      }

      if (data.currentPassword && data.currentPassword !== superAdminPass) {
        throw new UnauthorizedException('Current password does not match.');
      }

      const newAdmin = await this.prisma.admin.create({
        data: {
          tenantId: tenant.id,
          username: data.username.trim() || superAdminUser,
          password: data.newPassword?.trim() || superAdminPass,
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
        },
      });

      return {
        success: true,
        message: 'Super Admin credentials updated successfully.',
        user: { username: newAdmin.username, name: newAdmin.name, role: newAdmin.role },
      };
    }
  }
}
