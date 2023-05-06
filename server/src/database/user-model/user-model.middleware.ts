import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { UserModelService } from './user-model.service';
import ENVS from 'src/envs';

@Injectable()
export class UserMiddleware implements CanActivate {
  constructor(private readonly userService: UserModelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer '))
        throw 'Invalid token';

      const token = authHeader.split(' ')[1];

      const { _id }: any = verify(token, ENVS.JWT_USER_SECRET);
      const user: any = await this.userService.findById(_id);

      if (!user || !user.habilited) throw 'Invalid token';

      req.user = user;

      return true;
    } catch (e: any) {
      throw new HttpException(
        `Error with user middleware: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
