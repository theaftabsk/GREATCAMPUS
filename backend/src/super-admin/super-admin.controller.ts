import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';

@Controller('api/v1/super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('auth/login')
  async login(@Body() body: { username: string; pass: string }) {
    return this.superAdminService.login(body.username, body.pass);
  }

  @Get('dashboard')
  async getDashboard() {
    return this.superAdminService.getGlobalDashboard();
  }

  @Get('tenants')
  async getAllTenants() {
    const tenants = await this.superAdminService.getAllTenants();
    return { success: true, tenants };
  }

  @Post('tenants/:id/credits/allocate')
  async allocateCredits(
    @Param('id') tenantId: string,
    @Body() body: { amount: number; adminName?: string; notes?: string },
  ) {
    const result = await this.superAdminService.allocateCredits(
      tenantId,
      body.amount,
      body.adminName || 'Super Admin',
      body.notes,
    );
    return result;
  }

  @Post('tenants/:id/credits/adjust')
  async adjustLimit(
    @Param('id') tenantId: string,
    @Body() body: { newLimit: number; adminName?: string; reason?: string },
  ) {
    const result = await this.superAdminService.adjustLimit(
      tenantId,
      body.newLimit,
      body.adminName || 'Super Admin',
      body.reason,
    );
    return result;
  }

  @Get('tenants/:id/credit-history')
  async getCreditHistory(
    @Param('id') tenantId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const result = await this.superAdminService.getCreditHistory(tenantId, pageNum, limitNum, type);
    return { success: true, ...result };
  }
}
