import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ProctoringModule } from './proctoring/proctoring.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { HeadstartIntegrationModule } from './integration/headstart/headstart-integration.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    QuestionsModule,
    CandidatesModule,
    ProctoringModule,
    AssessmentsModule,
    HeadstartIntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
