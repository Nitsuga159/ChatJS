import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { SCOPES } from 'src/constants';
import ENVS from 'src/envs';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import ServerLogger from 'src/utils/logger';

@Injectable()
export class UserAccessTokenMiddleware implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: any = context.switchToHttp().getRequest()
    const access_token = typeof req.headers.authorization === "string" && req.headers.authorization.split(' ').pop()

    if (access_token) {
      try {
        req.accessTokenPayload = verify(access_token, ENVS.JWT_USER_SECRET)

        req.accessTokenPayload._id = new Types.ObjectId(req.accessTokenPayload._id)

        return true
      } catch (e) {
        this.logger.error("Error trying to get accessToken", e)
      }
    }

    throw new DefaultHttpException({ status: 401, message: 'Invalid access_token' })
  }

  private logger = new ServerLogger(UserAccessTokenMiddleware.name)
}

export const userScopeMiddleware = (validScope: SCOPES) => {
  @Injectable()
  class UserScopeMiddleware implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      try {
        const req: Request = context.switchToHttp().getRequest()
        const accessTokenPayload = (req as any).accessTokenPayload as string

        if (accessTokenPayload) {
          throw new DefaultHttpException({ status: 401, message: 'Not found access_token_payload' })
        }

        if (accessTokenPayload) {

        }

        return true
      } catch (e: any) {
        this.logger.error("Error trying to verify scope", e)
      }
    }

    public logger = new ServerLogger(UserScopeMiddleware.name)
  }

  return UserScopeMiddleware
}