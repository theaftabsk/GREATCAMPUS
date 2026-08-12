import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { HeadstartIntegrationModule } from '../integration/headstart/headstart-integration.module';

@Module({
  imports: [HeadstartIntegrationModule],
  providers: [CandidatesService],
  controllers: [CandidatesController],
})
export class CandidatesModule {}
