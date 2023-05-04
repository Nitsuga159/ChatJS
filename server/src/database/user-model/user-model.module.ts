import { Module } from '@nestjs/common';
import { User, UserSchema } from './user-model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMiddleware } from './user-model.middleware';
import { UserModelService } from './user-model.service';

const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [UserModel],
  providers: [UserModelService, UserMiddleware],
  exports: [UserModel, UserModelService, UserMiddleware],
})
export class UserModelModule {}
