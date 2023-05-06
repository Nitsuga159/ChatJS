import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import ENVS from 'src/envs';

@Injectable()
export class CodeVerificationMiddleware implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const { tokenMail } = req.query;

      if (!tokenMail) throw 'Invalid token mail';

      const { mail }: any = verify(tokenMail, ENVS.JWT_MAIL_SECRET);

      if (mail !== req.user.mail) throw 'Invalid token mail with the user body';

      return true;
    } catch (e: any) {
      throw new HttpException(
        `Error in mail code middleware: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
