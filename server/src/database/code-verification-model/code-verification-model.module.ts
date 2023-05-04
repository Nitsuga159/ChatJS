import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CodeVerification,
  CodeVerificationSchema,
} from './code-verification-model';

const CodeVerificationModel = MongooseModule.forFeature([
  { name: CodeVerification.name, schema: CodeVerificationSchema },
]);

@Module({
  imports: [CodeVerificationModel],
  exports: [CodeVerificationModel],
})
export class CodeVerificationModelModule {}
