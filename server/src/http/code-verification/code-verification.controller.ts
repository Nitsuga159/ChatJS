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
import bodyValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import BODY_MAP_VERIFY_CODE from './code-verification.body';
import { IS_STRING, NOT_FALSY } from 'src/utils/validators';

@Controller('code-verification')
export class CodeVerificationController {
  constructor(
    private readonly codeVerificationService: CodeVerificationService,
    ) {}
    
  @Post()
  @UseGuards(bodyValidationMiddleware([['body.mail', [NOT_FALSY, IS_STRING]]]))
  @HttpCode(HttpStatus.OK)
  async createCode(
    @Body('mail') mail: string, 
    @Headers(CONSTANS.HEADERS.X_TRANSACTION_ID) xTransactionId: string
    ): Promise<ResponseType> {
    this.logger.info(`Init createCode - ${xTransactionId}`)
      
    await this.codeVerificationService.create({ mail, xTransactionId })
      
    const response = { status: HttpStatus.OK, results: { success: true } };
      
    this.logger.info(`Ending createCode - ${xTransactionId}`)
      
    return response
  }
    
  @Post('verify')
  @UseGuards(bodyValidationMiddleware(BODY_MAP_VERIFY_CODE))
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() data: { mail: string; code: number },
    @Headers(CONSTANS.HEADERS.X_TRANSACTION_ID) xTransactionId: string
  ): Promise<ResponseType> { 
    this.logger.info(`Init verifyCode - ${xTransactionId}`)

    const results = await this.codeVerificationService.verify(data, xTransactionId)

    this.logger.info(`Ending verifyCode - ${xTransactionId}`)

    return { status: HttpStatus.OK, results } 
  }

  private readonly logger = new ServerLogger(CodeVerificationController.name)
}
