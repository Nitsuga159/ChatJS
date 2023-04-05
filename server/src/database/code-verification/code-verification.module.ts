import { Module } from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';
import { CodeVerificationController } from './code-verification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CodeVerification,
  CodeVerificationSchema,
} from './code-verification.model';
import { MailService } from 'src/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CodeVerification.name, schema: CodeVerificationSchema },
    ]),
    JwtModule,
  ],
  controllers: [CodeVerificationController],
  providers: [CodeVerificationService, MailService],
})
export class CodeVerificationModule {}
