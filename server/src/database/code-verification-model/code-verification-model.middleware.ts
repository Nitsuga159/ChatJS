import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import ServerLogger from 'src/utils/logger';

@Injectable()
export class CodeVerificationMiddleware implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest()
      const { tokenMail } = req.query

      verify(tokenMail, ENVS.JWT_MAIL_SECRET)

      return true;
    } catch (e: any) {
      this.logger.error('Error trying to verify access_token mail', e)
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Cannot create user' })
    }
  }

  private logger = new ServerLogger(CodeVerificationMiddleware.name)
}
