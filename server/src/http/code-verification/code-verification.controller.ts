import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';

@Controller('code-verification')
export class CodeVerificationController {
  constructor(
    private readonly codeVerificationService: CodeVerificationService,
  ) {}

  @Post(':mail')
  async createCode(@Param('mail') mail: string): Promise<{ success: boolean }> {
    return { success: await this.codeVerificationService.createCode(mail) };
  }

  @Post()
  async correctedCode(
    @Body() data: { mail: string; code: number },
  ): Promise<{ result: string | null }> {
    return { result: await this.codeVerificationService.correctCode(data) };
  }
}
