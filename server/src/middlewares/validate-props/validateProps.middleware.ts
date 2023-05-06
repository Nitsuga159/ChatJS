import {
  Injectable,
  HttpException,
  HttpStatus,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export default function validateProps(
  props: string[],
  keyObject: string,
  isForced: boolean,
  keyName?: string,
) {
  @Injectable()
  class ValidateProps implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      try {
        if (!/^\w+(\.\w+)*$/.test(keyObject))
          throw 'Use a correct notation of keyObject';

        const req: any = context.switchToHttp().getRequest();
        const data: any = {};
        const currentData: any = keyObject
          .split('.')
          .reduce((currentObject, key) => currentObject[key], req);

        if (
          !currentData ||
          typeof currentData !== 'object' ||
          Array.isArray(currentData)
        )
          throw `Expected object in the key not found. Key '${keyObject}'`;

        const keys: string[] = Object.keys(currentData);

        if (isForced && !this.haveAllProps(keys, props))
          throw 'You need to send all the required data';

        for (let prop of props) {
          if (keys.includes(prop)) data[prop] = currentData[prop];
        }

        if (keyName) req[keyName] = data;
        else req.data = data;

        return true;
      } catch (e) {
        throw new HttpException(
          `Error searching data: ${e}`,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    haveAllProps(keys: string[], props: string[]): boolean {
      for (let prop of props) if (!keys.includes(prop)) return false;

      return true;
    }
  }

  return ValidateProps;
}
