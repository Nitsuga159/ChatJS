import {
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
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import { ChannelService } from './channel.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { PROPS_UPDATE_CHANNEL } from './channel.type';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import {
  AdminMiddleware,
  FindChannelMiddleware,
  FindChatMiddleware,
} from 'src/database/channel-model/channel-model.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import bodyValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import { BODY_MAP_CHANNEL_ADD_CHAT, BODY_MAP_CHANNEL_CREATE, BODY_MAP_CHECK_CHANNEL_NOTIFICATION, MAP_DELETE_CHANNEL_CHAT, MAP_DELETE_PARTICIPANT_CHANNEL, MAP_UPDATE_CHANNEL, MAP_UPDATE_CHANNEL_CHAT } from './channel.body';
import makeResponse from 'src/utils/makeResponse';
import dataValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import { Types } from 'mongoose';

@Controller('channel')
@UseGuards(UserAccessTokenMiddleware)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) { }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async findAllByAdmin(@Req() req: any) {
    return makeResponse(
      await this.channelService.findAllByAdmin(req.accessTokenPayload._id, req._fields),
      HttpStatus.OK
    )
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any, @Query('lastId') lastId: string) {
    return makeResponse(
      await this.channelService.findAll(req.accessTokenPayload._id, lastId, req._fields),
      HttpStatus.OK
    )
  }

  @Get(':channelId')
  @HttpCode(HttpStatus.OK)
  async findById(@Req() req: any, @Param('channelId') channelId: string) {
    return makeResponse(
      await this.channelService.findById(req.accessTokenPayload._id, channelId, req._fields),
      HttpStatus.OK
    )
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UserAccessTokenMiddleware, bodyValidationMiddleware(BODY_MAP_CHANNEL_CREATE))
  async create(@Req() req: any) {
    return makeResponse(
      await this.channelService.create({ ...req.body, admin: req.accessTokenPayload._id }),
      HttpStatus.CREATED
    )
  }

  @Post('chat/:channelId')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(bodyValidationMiddleware(BODY_MAP_CHANNEL_ADD_CHAT))
  async addChat(@Req() req: any, @Param('channelId') channelId) {
    return makeResponse(
      await this.channelService.addChat({ 
          channelId, 
          adminId: req.accessTokenPayload._id, 
          chatName: req.body.chatName 
      }),
      HttpStatus.CREATED
    )
  }

  @Post('participant')
  @HttpCode(HttpStatus.OK)
  @UseGuards(bodyValidationMiddleware(BODY_MAP_CHECK_CHANNEL_NOTIFICATION), NotificationMiddleware)
  async addParticipant(@Req() req: any) {
    return await this.channelService.addParticipant(
      req.body.invitationId,
      req.accessTokenPayload._id,
      req._fields
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
  @UseGuards(bodyValidationMiddleware(MAP_UPDATE_CHANNEL_CHAT))
  async updateChat(@Req() req: any) {
    await this.channelService.updateChat(
      req.params.channelId, 
      req.accessTokenPayload._id, 
      req.query.chatId, 
      req.body
    );

    return makeResponse({ success: true }, HttpStatus.OK)
  }

  @Put(':channelId')
  @UseGuards(dataValidationMiddleware(MAP_UPDATE_CHANNEL))
  async update(@Req() req: any) {
    await this.channelService.update(req.params.channelId, req.accessTokenPayload._id, req.body);

    return makeResponse({ success: true }, HttpStatus.OK)
  }


  @Delete('participant/:channelId')
  @UseGuards(dataValidationMiddleware(MAP_DELETE_PARTICIPANT_CHANNEL))
  async deleteParticipant(@Req() req: any) {
    await this.channelService.deleteParticipant(
      req.params.channelId,
      req.accessTokenPayload._id,
      req.query.participantId
    );

    return makeResponse({ success: true }, HttpStatus.OK)
  }

  @Delete('chat/:channelId')
  @UseGuards(dataValidationMiddleware(MAP_DELETE_CHANNEL_CHAT))
  @HttpCode(HttpStatus.OK)
  async deleteChat(@Req() req: any, @Param('channelId') channelId: string, @Query('chatId') chatId: string) {
    return makeResponse(
      await this.channelService.deleteChat(channelId, req.accessTokenPayload._id, chatId),
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
