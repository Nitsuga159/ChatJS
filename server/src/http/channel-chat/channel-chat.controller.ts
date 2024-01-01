import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ChannelChatService } from './channel-chat.service';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import { Types } from 'mongoose';
import makeResponse from 'src/utils/makeResponse';
import CHANNEL_CHAT_BODY from './channel-chat.body';
import dataValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';

@Controller('channel-chat')
@UseGuards(UserAccessTokenMiddleware)
export class ChannelChatController {
  constructor(private readonly channelChatService: ChannelChatService) { }

  @Get('message/:channelId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(dataValidationMiddleware(CHANNEL_CHAT_BODY.GET_CHANNEL_CHAT_MESSAGES))
  async get(@Req() req: any) {
    return makeResponse(
      await this.channelChatService.get(
        new Types.ObjectId(req.accessTokenPayload._id),
        new Types.ObjectId(req.params.channelId),
        new Types.ObjectId(req.query.chatId),
        req.query.lastId,
        req._fields
      ),
      HttpStatus.OK
    )
  }

  @Post('message')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(dataValidationMiddleware(CHANNEL_CHAT_BODY.ADD_CHANNEL_CHAT_MESSAGE))
  async add(@Req() req: any) {
    const message = await this.channelChatService.add(
      req.body.channelChatData,
      { ...req.body.message, sender: req.accessTokenPayload._id },
      req._fields
    )

    return makeResponse(message, HttpStatus.CREATED)
  }
  
  @Delete('message/:channelId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(dataValidationMiddleware(CHANNEL_CHAT_BODY.DELETE_CHANNEL_CHAT_MESSAGES))
  async delete(@Req() { query, params, accessTokenPayload }: any) {
    return makeResponse(
      await this.channelChatService.delete(
        query.ids.split(','),
        params.channelId,
        query.chatId,
        accessTokenPayload._id
      ),
      HttpStatus.OK
    )
  }
}
