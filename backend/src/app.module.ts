import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ProctoringModule } from './proctoring/proctoring.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
