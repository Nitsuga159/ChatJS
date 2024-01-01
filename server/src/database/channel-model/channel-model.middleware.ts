import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ChannelModelService } from './channel-model.service';
import { ChannelDocument } from './channel.model';
import { Types } from 'mongoose';

@Injectable()
export class FindChannelMiddleware implements CanActivate {
  constructor(private readonly channelModelService: ChannelModelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();

      const { _id } = req.user;
      const { channelId } = req.params;

      if (!channelId) throw 'Invalid channel';

      const channelDocument: ChannelDocument | null =
        await this.channelModelService.findByOtherData({
          _id: channelId,
          $or: [{ participants: { $in: [_id] } }],
        });

      if (!channelDocument) throw 'Invalid channel with this user';

      req.channelDocument = channelDocument;

      return true;
    } catch (e) {
      throw new HttpException(
        `Error in find channel middleware: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

@Injectable()
export class AdminMiddleware implements CanActivate {
  constructor(private readonly channelModelService: ChannelModelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const { _id } = req.user;
      const { channelId } = req.params;

      if (!channelId) {
        throw 'Invalid channel';
      }

      const channelDocument: ChannelDocument | null =
        await this.channelModelService.findByAdmin(channelId, _id);

      if (!channelDocument) {
        throw 'Invalid channel with this user';
      }

      req.channelDocument = channelDocument;

      return true;
    } catch (e) {
      throw new HttpException(
        `Error in admin channel middleware: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

@Injectable()
export class FindChatMiddleware implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();
      const { chatId } = req.query;
      const { chats } = req.channelDocument as ChannelDocument;

      const indexChat: number = chats.findIndex(
        (chat) => chat._id.toString() === chatId,
      );

      if (indexChat < 0) throw 'Invalid channel';

      req.chatId = new Types.ObjectId(chatId);
      req.channelChat = chats[indexChat];

      return true;
    } catch (e) {
      throw new HttpException(
        `Error in find chat channel middleware: ${e}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
