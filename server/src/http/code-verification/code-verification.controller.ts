import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';

@Controller('code-verification')
export class CodeVerificationController {
  constructor(
    private readonly codeVerificationService: CodeVerificationService,
  ) {}

  @Post(':mail')
  async createCode(@Param('mail') mail: string): Promise<{ success: boolean }> {
    try {
      return { success: await this.codeVerificationService.create(mail) };
    } catch (e: any) {
      throw new HttpException(
        `Error creating mail code:${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async correctedCode(
    @Body() data: { mail: string; code: number },
  ): Promise<{ result: string | null }> {
    try {
      return { result: await this.codeVerificationService.verify(data) };
    } catch (e: any) {
      throw new HttpException(
        `Error verifying mail code:${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
