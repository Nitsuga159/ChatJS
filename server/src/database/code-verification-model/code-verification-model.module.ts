import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CodeVerification,
  CodeVerificationSchema,
} from './code-verification-model';
import { CodeVerificationMiddleware } from './code-verification-model.middleware';

const CodeVerificationModel = MongooseModule.forFeature([
  { name: CodeVerification.name, schema: CodeVerificationSchema },
]);

@Module({
  imports: [CodeVerificationModel],
  providers: [CodeVerificationMiddleware],
  exports: [CodeVerificationModel, CodeVerificationMiddleware],
})
export class CodeVerificationModelModule {}
