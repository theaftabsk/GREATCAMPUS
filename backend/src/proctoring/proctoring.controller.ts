import { Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { ProctoringService } from './proctoring.service';

@Controller('api/v1/proctoring')
export class ProctoringController {
  private readonly logger = new Logger(ProctoringController.name);

  constructor(private readonly proctoringService: ProctoringService) {}

  @Post('upload-screenshot')
  async uploadScreenshot(
    @Body()
    body: {
      attemptId: string;
      type: 'SCHEDULED' | 'WARNING';
      eventType?: string;
      imageBase64: string;
    }
  ) {
    if (!body.attemptId || !body.imageBase64) {
      return { success: false, message: 'attemptId and imageBase64 are required.' };
    }

    const result = await this.proctoringService.saveScreenshot(body);
    return result;
  }

  @Get('screenshots/:attemptId')
  async getScreenshots(@Param('attemptId') attemptId: string) {
    const screenshots = await this.proctoringService.getScreenshotsForAttempt(attemptId);
    return { success: true, count: screenshots.length, screenshots };
  }
}
