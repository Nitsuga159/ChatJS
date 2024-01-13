import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CodeVerificationService } from './code-verification.service';
import ServerLogger from 'src/utils/logger';
import ResponseType from 'src/interfaces/responseType';
import CONSTANS from 'src/constants';
import { CodeVerification, CodeVerificationVerify } from './code-verification.body';

@Controller('code-verification')
export class CodeVerificationController {
  constructor(
    private readonly codeVerificationService: CodeVerificationService,
    ) {}
    
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCode(
    @Body() { mail }: CodeVerification,
    ): Promise<ResponseType> {
      
    await this.codeVerificationService.create({ mail })
      
    const response = { status: HttpStatus.OK, results: { success: true } };
      
    return response
  }
    
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() data: CodeVerificationVerify
  ) { 

    const results = await this.codeVerificationService.verify(data)

    return { status: HttpStatus.OK, results } 
  }

  private readonly logger = new ServerLogger(CodeVerificationController.name)
}
