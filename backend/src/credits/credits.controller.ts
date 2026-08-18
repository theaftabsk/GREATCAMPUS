import { Controller, Get, Param } from '@nestjs/common';
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

  @Get('quota/:tenantId')
  async getTenantQuota(@Param('tenantId') tenantId: string) {
    const stats = await this.creditsService.getTenantStats(tenantId);
    return {
      success: true,
      ...stats,
    };
  }
}
