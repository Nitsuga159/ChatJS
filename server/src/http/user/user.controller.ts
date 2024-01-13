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
import { CodeVerificationMiddleware } from 'src/database/code-verification-model/code-verification-model.middleware';
import { UserAccessTokenMiddleware } from './user.middleware';
import makeResponse from 'src/utils/makeResponse';
import { BodyMapUser, BodyMapUserDefault, BodyMapUserPasswordChange, UserFields, UserFieldsLastId, UserParam } from './user.body';


@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async getUserInfo(@Req() req: any, @Query() query: UserFields) {

    return makeResponse(
      await this.usersService.findById(req.accessTokenPayload._id, query.fields),
      HttpStatus.OK
    )
  }

  @Get('info/all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async findUsers(@Query() query: UserFieldsLastId) { 
    return makeResponse(
      this.usersService.find(query.lastId, query.fields),
      HttpStatus.OK
    ) 
  }

  @Get('info/name')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async findByUsername(
    @Query('username') username: string = "",
    @Query('lastId') lastId: string,
    @Req() { accessTokenPayload }: any,
    @Query() query: UserFields
  ) {
    return makeResponse(
      await this.usersService.findByUsername(username, lastId, accessTokenPayload._id, query.fields),
      HttpStatus.OK
    )
  }

  @Get('info/:_id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserAccessTokenMiddleware)
  async getUserInfoSelected(@Param() params: UserParam, @Query() query: UserFields) {
    return makeResponse(
      await this.usersService.findById(params._id, query.fields),
      HttpStatus.OK
    )
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: BodyMapUserDefault) { 
    return makeResponse(await this.usersService.login(body), HttpStatus.OK) 
  }

  @Post('register')
  @UseGuards(CodeVerificationMiddleware)
  async createUser(@Body() user: BodyMapUser) { return await this.usersService.create(user) }

  @Put('update')
  @UseGuards(UserAccessTokenMiddleware)
  async update(@Req() req: any, @Query() query: UserFields) {
    return makeResponse(
      await this.usersService.update(req.accessTokenPayload._id, req.body, query.fields),
      HttpStatus.CREATED
    )
  }

  @Put('change-password')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UserAccessTokenMiddleware)
  async changePassword(@Req() req: any, @Body() body: BodyMapUserPasswordChange) { 
    return { status: HttpStatus.CREATED, results: {
      success:await this.usersService.changePassword(req.accessTokenPayload._id, body)
    }} 
  }

}
