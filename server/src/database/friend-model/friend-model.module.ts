import { Module } from '@nestjs/common';
import { Friend, FriendSchema } from './friend-model';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendModelService } from './friend-model.service';
import { FriendMiddleware } from './friend-model.middleware';

const FriendModel = MongooseModule.forFeature([
  { name: Friend.name, schema: FriendSchema },
]);

@Module({
  imports: [FriendModel],
  providers: [FriendModelService, FriendMiddleware],
  exports: [FriendModel, FriendModelService, FriendMiddleware],
})
export class FriendModelModule {}
