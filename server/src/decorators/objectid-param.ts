import { createParamDecorator, BadRequestException } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Types } from 'mongoose';

export const ObjectIdParam = createParamDecorator((data: string, req: ExecutionContextHost) => {
  const value = req.switchToHttp().getRequest().params[data];
  const isValidObjectId = Types.ObjectId.isValid(value);
  if (!isValidObjectId) {
    throw new BadRequestException('Invalid ObjectId format');
  }
  return new Types.ObjectId(value);
});
