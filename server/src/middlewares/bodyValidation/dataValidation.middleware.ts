import {
  Injectable,
  HttpStatus,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import ServerLogger from 'src/utils/logger';
import { CallbackValidator, IS_OBJECT_ID, VALIDATOR_ERRORS } from 'src/utils/validators';

export type bodyValidationProps = [string, CallbackValidator[]][]

export default function (bodyMap: [string, CallbackValidator[]][], from: "HTTP" | "WS" = "HTTP") {
  @Injectable()
  class ValidateProps implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const req: any = from === "HTTP" ? context.switchToHttp().getRequest() : context.switchToWs().getClient<Socket>().data;

      for (let [key, cbValidations] of bodyMap) {
        const [value, changer] = this.getValue(key.replace("?", ""), req)

        if (typeof value === "undefined" && key.at(-1) === '?') {
          continue
        }

        for (let cb of cbValidations) {
          const { name, valid } = cb(value)

          if (!valid) {
            if (from === "HTTP") {
              throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: `'${key.replace("?", "")}' ${VALIDATOR_ERRORS[name]}` })
            } else {
              return false
            }
          } else if(cb === IS_OBJECT_ID) {
            changer((value) => new Types.ObjectId(value))
          }
        }
      }

      return true
    }

    private getValue(key: string, req: Request): [any, (cb: any) => void] {
      let keys = key.split('.')
      let value = req
      let prev = null

      try {
        for (let key of keys) {
          prev = value
          value = value[key]
        }
      } finally {
        return [value, (cb) => prev[keys.at(-1)] = cb(prev[keys.at(-1)])]
      }
    }

    private logger = new ServerLogger(ValidateProps.name)
  }

  return ValidateProps;
}
