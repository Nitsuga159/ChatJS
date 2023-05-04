import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { FriendDocument } from './friend-model';
import { FriendModelService } from './friend-model.service';

@Injectable()
export class FriendMiddleware implements CanActivate {
  constructor(private readonly friendModelService: FriendModelService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req: any = context.switchToHttp().getRequest();

      const { _id } = req.user;
      const { friendId } = req.params;

      if (!friendId) throw 'Invalid friend';

      const friendDocument: FriendDocument | null =
        await this.friendModelService.findByOtherData({
          _id: friendId,
          $or: [{ user1: _id }, { user2: _id }],
        });

      if (!friendDocument) throw 'Invalid friend with this user';

      req.friendDocument = friendDocument;

      return true;
    } catch (e) {
      throw new HttpException(`Error: ${e}`, HttpStatus.BAD_REQUEST);
    }
  }
}
