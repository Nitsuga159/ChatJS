import { Module } from '@nestjs/common';
import { UserChannelController } from './user-channel.controller';
import { UserChannelService } from './user-channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserChannel, UserChannelSchema } from './user-channel.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserChannel.name, schema: UserChannelSchema },
    ]),
  ],
  controllers: [UserChannelController],
  providers: [UserChannelService],
})
export class UserChannelModule {}
