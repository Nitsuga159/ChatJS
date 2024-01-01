import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UserDocument } from '../../database/user-model/user-model';
import { CodeVerificationMiddleware } from 'src/database/code-verification-model/code-verification-model.middleware';
import {
  UserRequest,
} from '../../database/user-model/user-model.type';
import bodyValidationMiddleware from 'src/middlewares/bodyValidation/dataValidation.middleware';
import { BODY_MAP_CHANGE_PASSWORD, BODY_MAP_LOGIN_REQUEST, BODY_MAP_UPDATE_DATA, BODY_MAP_USER } from './user.body';
import { UserAccessTokenMiddleware } from './user.middleware';
import makeResponse from 'src/utils/makeResponse';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async getUserInfo(@Req() req: any) {
    return makeResponse(
      await this.usersService.findById(req.accessTokenPayload._id, req._fields),
      HttpStatus.OK
    )
  }

  @Get('info/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async findUsers(@Req() req: any, @Query('lastId') lastId: string) { 
    return makeResponse(
      this.usersService.find(lastId, req._fields),
      HttpStatus.OK
    ) 
  }

  @Get('info/name')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async findByUsername(
    @Query('username') username: string = "",
    @Query('lastId') lastId: string,
    @Req() { accessTokenPayload, _fields }: any,
  ) {
    return makeResponse(
      await this.usersService.findByUsername(username, lastId, accessTokenPayload._id, _fields),
      HttpStatus.OK
    )
  }

  @Get('info/:_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async getUserInfoSelected(@Param('_id') _id: string, @Req() req: any) {
    return makeResponse(
      await this.usersService.findById(_id, req._fields),
      HttpStatus.OK
    )
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(bodyValidationMiddleware(BODY_MAP_LOGIN_REQUEST))
  async login(@Req() req: any) { return makeResponse(await this.usersService.login(req.body), HttpStatus.OK) }

  @Post('register')
  @UseGuards(bodyValidationMiddleware(BODY_MAP_USER), CodeVerificationMiddleware)
  async createUser(@Body() user: UserRequest): Promise<UserDocument> { return await this.usersService.create(user) }

  @Put('update')
  @UseGuards(UserAccessTokenMiddleware, bodyValidationMiddleware(BODY_MAP_UPDATE_DATA))
  async update(@Req() req: any) {
    return makeResponse(
      await this.usersService.update(req.accessTokenPayload._id, req.body, req._fields),
      HttpStatus.CREATED
    )
  }

  @Put('change-password')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UserAccessTokenMiddleware, bodyValidationMiddleware(BODY_MAP_CHANGE_PASSWORD))
  async changePassword(@Req() req: any) { 
    return { status: HttpStatus.CREATED, results: {
      success:await this.usersService.changePassword(req.accessTokenPayload._id, req.body)
    }} 
  }

}
