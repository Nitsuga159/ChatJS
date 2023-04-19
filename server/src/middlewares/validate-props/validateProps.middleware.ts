import {
  Injectable,
  HttpException,
  HttpStatus,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Method, Props } from './validateProps.type';

export default function validateProps(
  props: Props,
  method: Method,
  force: boolean,
) {
  @Injectable()
  class ValidateProps implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const req: any = context.switchToHttp().getRequest();
      const data: any = {};
      const keys: string[] = Object.keys(req[method]);

      if (force && !this.haveAllProps(keys, props))
        throw new HttpException(
          'You need to send all the required data',
          HttpStatus.BAD_REQUEST,
        );

      for (let prop of props) {
        if (keys.includes(prop)) data[prop] = req[method][prop];
      }

      req.data = data;

      return true;
    }

    haveAllProps(keys: string[], props: Props): boolean {
      for (let prop of props) if (!keys.includes(prop)) return false;

      return true;
    }
  }

  return ValidateProps;
}
