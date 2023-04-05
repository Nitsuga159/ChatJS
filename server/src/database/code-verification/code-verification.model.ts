import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export type CodeVerificationDocument = CodeVerification & Document;

@Schema()
export class CodeVerification {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  mail: string;

  @Prop({ required: true })
  @IsInt()
  @Min(100000)
  @Max(999999)
  code: number;
}

export const CodeVerificationSchema =
  SchemaFactory.createForClass(CodeVerification);
