import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channel.model';
import { ChannelModelService } from './channel-model.service';

const ChannelModel = MongooseModule.forFeature([
  { name: Channel.name, schema: ChannelSchema },
]);

@Module({
  imports: [ChannelModel],
  providers: [ChannelModelService],
  exports: [ChannelModel, ChannelModelService],
})
export class ChannelModelModule {}
