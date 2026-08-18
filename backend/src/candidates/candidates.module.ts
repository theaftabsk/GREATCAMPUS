import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { HeadstartIntegrationModule } from '../integration/headstart/headstart-integration.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [HeadstartIntegrationModule, EmailModule],
  providers: [CandidatesService],
  controllers: [CandidatesController],
})
export class CandidatesModule {}
