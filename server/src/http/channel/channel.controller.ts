import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import {
  AdminMiddleware,
  FindChannelMiddleware,
  FindChatMiddleware,
} from 'src/database/channel-model/channel-model.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import makeResponse from 'src/utils/makeResponse';
import { Types } from 'mongoose';
import { BodyMapChannelAddChat, BodyMapChannel, BodyMapUpdateChannelChat, ChannelChatId, ChannelQuery, ChannelId } from './channel.body';
import { QueryParameters } from 'src/utils/validators';

@Controller('channel')
@UseGuards(UserAccessTokenMiddleware)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) { }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async findAllByAdmin(@Req() req: any, @Query() { fields }: ChannelQuery) {
    return makeResponse(
      await this.channelService.findAllByAdmin(req.accessTokenPayload._id, fields),
      HttpStatus.OK
    )
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any, @Query() query: ChannelQuery,) {
    return makeResponse(
      await this.channelService.findAll(req.accessTokenPayload._id, query),
      HttpStatus.OK
    )
  }

  @Get(':channelId')
  @HttpCode(HttpStatus.OK)
  async findById(@Req() req: any, @Param() { channelId }: ChannelId, @Query() { fields }: ChannelQuery) {
    return makeResponse(
      await this.channelService.findById(req.accessTokenPayload._id, channelId, fields),
      HttpStatus.OK
    )
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() body: BodyMapChannel) {
    return makeResponse(
      await this.channelService.create({ ...body, admin: req.accessTokenPayload._id }),
      HttpStatus.CREATED
    )
  }

  @Post('chat/:channelId')
  @HttpCode(HttpStatus.CREATED)
  async addChat(@Req() req: any, @Param() { channelId }: ChannelId, @Body() { chatName }: BodyMapChannelAddChat) {
    return makeResponse(
      await this.channelService.addChat({ 
          channelId, 
          chatName,
          adminId: req.accessTokenPayload._id, 
      }),
      HttpStatus.CREATED
    )
  }

  @Post('participant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(NotificationMiddleware)
  async addParticipant(@Req() req: any, @Query() { fields }: ChannelQuery) {
    return await this.channelService.addParticipant(
      req.body.invitationId,
      req.accessTokenPayload._id,
      fields
    );
  }

  @Post('read/:channelId')
  @UseGuards(FindChannelMiddleware, FindChatMiddleware)
  async read(@Req() req: any): Promise<void> {
    try {
      return await this.channelService.readMessages(
        req.channelDocument,
        req.channelChat,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error to read messages: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('chat/:channelId')
  @HttpCode(HttpStatus.OK)
  async updateChat(@Req() req: any, @Param() { channelId }: ChannelId, @Query() { chatId }: ChannelChatId, @Body() data: BodyMapUpdateChannelChat) {
    await this.channelService.updateChat(
      channelId, 
      req.accessTokenPayload._id, 
      chatId, 
      data
    );

    return makeResponse({ success: true }, HttpStatus.OK)
  }

  @Put(':channelId')
  async update(@Req() req: any, @Param() { channelId }: ChannelId, @Body() data: BodyMapChannel) {
    await this.channelService.update(channelId, req.accessTokenPayload._id, data);

    return makeResponse({ success: true }, HttpStatus.OK)
  }


  @Delete('participant/:channelId')
  async deleteParticipant(@Req() req: any, @Param() params: ChannelId) {
    await this.channelService.deleteParticipant(
      params.channelId,
      req.accessTokenPayload._id,
      req.query.participantId
    );

    return makeResponse({ success: true }, HttpStatus.OK)
  }

  @Delete('chat/:channelId')
  @HttpCode(HttpStatus.OK)
  async deleteChat(@Req() req: any, @Param() params: ChannelId, @Query() query: ChannelChatId) {
    return makeResponse(
      await this.channelService.deleteChat(params.channelId, req.accessTokenPayload._id, query.chatId),
      HttpStatus.OK
    )
  }

  @Delete(':channelId')
  async deleteChannel(@Req() req: any, @Param('channelId') channelId: Types.ObjectId) {
    return makeResponse(
      await this.channelService.delete(channelId, req.accessTokenPayload._id),
      HttpStatus.OK
    )
  }
}
