import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChannelChatService } from './channel-chat.service';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import { BodyChannelChatData, BodyChannelChatMessage, ChannelChatChannelId, ChannelChatChatId, ChannelChatQuery, ChannelChatIds } from './channel-chat.body';

@Controller('channel-chat')
@UseGuards(UserAccessTokenMiddleware)
export class ChannelChatController {
  constructor(private readonly channelChatService: ChannelChatService) { }

  @Get('message/:channelId')
  @HttpCode(HttpStatus.OK)
  async get(@Req() req: any, @Param() { channelId }: ChannelChatChannelId, @Query() query: ChannelChatChatId) {
    return await this.channelChatService.get(
        req.accessTokenPayload._id,
        channelId,
        query
      )
  }

  @Post('message')
  @HttpCode(HttpStatus.CREATED)
  async add(@Req() req: any, @Body('channelChatData') channelChatData: BodyChannelChatData, @Body('message') message: BodyChannelChatMessage, @Query() query: ChannelChatQuery) {
    const createdMessage = await this.channelChatService.add(
      channelChatData,
      { ...message, sender: req.accessTokenPayload._id },
      query.fields
    )

    return createdMessage
  }
  
  @Delete('message/:channelId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() { accessTokenPayload }: any, 
    @Query() { chatId }: ChannelChatChatId, 
    @Param() { channelId }: ChannelChatChannelId,
    @Query() { ids }: ChannelChatIds
  ) {
    return await this.channelChatService.delete(
        ids.split(','),
        channelId,
        chatId,
        accessTokenPayload._id
      )
  }
}
