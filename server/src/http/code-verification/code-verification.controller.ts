import {
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';
import ServerLogger from 'src/utils/logger';

@Controller('code-verification')
export class CodeVerificationController {
  constructor(
    private readonly codeVerificationService: CodeVerificationService,
    ) {}
    
    @Post(':mail')
    async createCode(@Param('mail') mail: string): Promise<{ success: boolean }> {
    this.logger.info("Init createCode")

    return { success: true }

    return { success: await this.codeVerificationService.create(mail) };
  }

  @Post()
  async verifyCode(
    @Body() data: { mail: string; code: number },
  ): Promise<{ result: string | null }> { 
    this.logger.info("Init verifyCode")

    return { result: await this.codeVerificationService.verify(data) } 
  }

  private readonly logger = new ServerLogger(CodeVerificationController.name)
}
