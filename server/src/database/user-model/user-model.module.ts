import { Module } from '@nestjs/common';
import { User, UserSchema } from './user-model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMiddleware } from './user-model.middleware';
import { UserModelService } from './user-model.service';
import { UserType, UserTypeSchema } from '../user-types-model/user-model';

const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: UserType.name, schema: UserTypeSchema }
]);

@Module({
  imports: [UserModel],
  providers: [UserModelService, UserMiddleware],
  exports: [UserModel, UserModelService, UserMiddleware],
})
export class UserModelModule {}
