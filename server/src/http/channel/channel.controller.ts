import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';
import { ChannelDocument } from 'src/database/channel-model/channel.model';
import { ChannelService } from './channel.service';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import { PROPS_NEW_CHANNEL, PROPS_UPDATE_CHANNEL } from './channel.type';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import {
  AdminMiddleware,
  FindChannelMiddleware,
  FindChatMiddleware,
} from 'src/database/channel-model/channel-model.middleware';

@Controller('channel')
@UseGuards(UserMiddleware)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  async findAll(
    @Req() req: any,
    @Query('lastId') lastId: string,
  ): Promise<{ continue: boolean; results: ChannelDocument[] }> {
    try {
      return this.channelService.findAll(req.user._id, lastId);
    } catch (e: any) {
      throw new HttpException(
        `Error to get user channels: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':channelId')
  async findById(
    @Req() req: any,
    @Param('channelId') channelId: string,
  ): Promise<ChannelDocument> {
    try {
      return this.channelService.findById(req.user._id, channelId);
    } catch (e: any) {
      throw new HttpException(
        `Error to get channel detail: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @UseGuards(validateProps(PROPS_NEW_CHANNEL, 'body', false, 'channel'))
  async create(@Req() req: any): Promise<ChannelDocument> {
    try {
      return this.channelService.create({
        ...req.channel,
        admin: req.user._id,
      });
    } catch (e: any) {
      throw new HttpException(
        `Error to create a channel: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('add-chat/:channelId')
  @UseGuards(AdminMiddleware)
  async addChat(@Req() req: any, @Query('chatName') chatName: string) {
    try {
      return await this.channelService.addChat(req.channelDocument, chatName);
    } catch (e: any) {
      throw new HttpException(
        `Error to create a chat channel: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('add-participant')
  @UseGuards(NotificationMiddleware)
  async addParticipant(@Req() req: any): Promise<void> {
    try {
      await this.channelService.addParticipant(
        req.notification.invitationId,
        req.user._id,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error to add a participant: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
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

  @Put(':channelId')
  @UseGuards(
    AdminMiddleware,
    validateProps(PROPS_UPDATE_CHANNEL, 'body', false, 'channelProps'),
  )
  async update(@Req() req: any) {
    try {
      return this.channelService.update(req.channelDocument, req.channelProps);
    } catch (e: any) {
      throw new HttpException(
        `Error to update channel: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete-participant/:channelId')
  @UseGuards(AdminMiddleware)
  async deleteParticipant(@Req() req: any, @Query('userId') userId: string) {
    try {
      return await this.channelService.deleteParticipant(
        req.channelDocument,
        userId,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error to delete a participant: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete-chat/:channelId')
  @UseGuards(AdminMiddleware, FindChatMiddleware)
  async deleteChat(@Req() req: any) {
    try {
      return await this.channelService.deleteChat(
        req.channelDocument,
        req.chatId,
      );
    } catch (e: any) {
      throw new HttpException(
        `Error to delete a chat channel: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
