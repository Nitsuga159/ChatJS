import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToUser, UserToUserSchema } from './user-to-user.model';
import { UserToUserController } from './user-to-user.controller';
import { UserToUserService } from './user-to-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserToUser.name, schema: UserToUserSchema },
    ]),
  ],
  controllers: [UserToUserController],
  providers: [UserToUserService],
})
export class UserToUserModule {}
