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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { NotificationMiddleware } from 'src/database/notification-model/notification-model.middleware';
import {
  AdminMiddleware,
  FindChannelMiddleware,
  FindChatMiddleware,
} from 'src/database/channel-model/channel-model.middleware';
import { UserAccessTokenMiddleware } from '../user/user.middleware';
import { Types } from 'mongoose';
import { BodyMapChannelAddChat, BodyMapChannel, BodyMapUpdateChannelChat, ChannelChatId, ChannelQuery, ChannelId } from './channel.body';
import { QueryParameters } from 'src/utils/validators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('channel')
@UseGuards(UserAccessTokenMiddleware)
export class ChannelController {
  constructor(private readonly channelService: ChannelService) { }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  async findAllByAdmin(@Req() req: any, @Query() { fields }: ChannelQuery) {
    return await this.channelService.findAllByAdmin(req.accessTokenPayload._id, fields)
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any, @Query() query: ChannelQuery,) {
    return await this.channelService.findAll(req.accessTokenPayload._id, query)
  }

  @Get(':channelId')
  @HttpCode(HttpStatus.OK)
  async findById(@Req() req: any, @Param() { channelId }: ChannelId, @Query() { fields }: ChannelQuery) {
    return await this.channelService.findById(req.accessTokenPayload._id, channelId, fields)
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor("photo"))
  async create(@Req() req: any, @UploadedFile() photo: Express.Multer.File, @Body() body: { name: string, description?: string }) {
    return await this.channelService.create({ ...body, photo, admin: req.accessTokenPayload._id })
  }

  @Post('chat/:channelId')
  @HttpCode(HttpStatus.CREATED)
  async addChat(@Req() req: any, @Param() { channelId }: ChannelId, @Body() { chatName }: BodyMapChannelAddChat) {
    return await this.channelService.addChat({ 
          channelId, 
          chatName,
          adminId: req.accessTokenPayload._id, 
      })
  }

  @Post('participant')
  @HttpCode(HttpStatus.CREATED)
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

    return { success: true }
  }

  @Put(':channelId')
  async update(@Req() req: any, @Param() { channelId }: ChannelId, @Body() data: BodyMapChannel) {
    await this.channelService.update(channelId, req.accessTokenPayload._id, data);

    return { success: true }
  }


  @Delete('participant/:channelId')
  async deleteParticipant(@Req() req: any, @Param() params: ChannelId) {
    await this.channelService.deleteParticipant(
      params.channelId,
      req.accessTokenPayload._id,
      req.query.participantId
    );

    return { success: true }
  }

  @Delete('chat/:channelId')
  @HttpCode(HttpStatus.OK)
  async deleteChat(@Req() req: any, @Param() params: ChannelId, @Query() query: ChannelChatId) {
    return await this.channelService.deleteChat(params.channelId, req.accessTokenPayload._id, query.chatId)
  }
  
  @Delete(':channelId')
  @HttpCode(HttpStatus.OK)
  async deleteChannel(@Req() req: any, @Param('channelId') channelId: Types.ObjectId) {
    return await this.channelService.delete(channelId, req.accessTokenPayload._id)
  }
}
