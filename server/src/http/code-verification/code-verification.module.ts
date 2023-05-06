import { Module } from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';
import { CodeVerificationController } from './code-verification.controller';
import { MailService } from 'src/mail/mail.service';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { CodeVerificationModelModule } from 'src/database/code-verification-model/code-verification-model.module';

@Module({
  imports: [UserModelModule, CodeVerificationModelModule],
  controllers: [CodeVerificationController],
  providers: [CodeVerificationService, MailService],
})
export class CodeVerificationModule {}
