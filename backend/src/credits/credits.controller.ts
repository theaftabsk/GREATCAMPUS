import { Controller, Get, Param, Query } from '@nestjs/common';
import { CreditsService } from './credits.service';

@Controller('api/v1/credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get('quota')
  async getQuota() {
    const stats = await this.creditsService.getTenantStats();
    return {
      success: true,
      ...stats,
    };
  }

  @Get('history')
  async getHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ) {
    const tenant = await this.creditsService.getOrCreateDefaultTenant();
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '50', 10);
    const result = await this.creditsService.getCreditHistory(tenant.id, pageNum, limitNum, type, search);
    return {
      success: true,
      ...result,
    };
  }

  @Get('quota/:tenantId')
  async getTenantQuota(@Param('tenantId') tenantId: string) {
    const stats = await this.creditsService.getTenantStats(tenantId);
    return {
      success: true,
      ...stats,
    };
  }
}
