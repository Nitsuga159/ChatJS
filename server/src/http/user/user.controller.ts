import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User, UserDocument } from '../../database/user-model/user-model';
import { CodeVerificationMiddleware } from 'src/database/code-verification-model/code-verification-model.middleware';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import {
  FindUserResponse,
  LoginResponseType,
  PROPS_UPDATE_USER,
  UserType,
} from '../../database/user-model/user-model.type';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(UserMiddleware)
  async findUsers(@Query('lastId') lastId: string): Promise<FindUserResponse> { return this.usersService.find(lastId) }

  @Get('name')
  @UseGuards(UserMiddleware)
  async findByUsername(
    @Query('username') username: string,
    @Query('lastId') lastId: string,
    @Req() { user }: any,
  ): Promise<{ result: UserDocument[]; continue: boolean }> { return this.usersService.findByUsername(username, lastId, user._id) }

  @Get('login-token')
  @UseGuards(UserMiddleware)
  async loginToken(@Req() req: any): Promise<LoginResponseType> { return await this.usersService.loginToken(req.user.toObject()) }

  @Post('login')
  @UseGuards(validateProps(UserController.PROPS_LOGIN, 'body', true))
  async login(@Req() req: any): Promise<LoginResponseType> { return await this.usersService.login(req.data) }

  @Post('register')
  @UseGuards(CodeVerificationMiddleware)
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: UserType): Promise<UserDocument> { return await this.usersService.create(user) }

  @Put('update')
  @UseGuards(UserMiddleware)
  @UseGuards(validateProps(PROPS_UPDATE_USER, 'query', false))
  async update(@Req() req: any): Promise<UserDocument> { return await this.usersService.update(req.user._id, req.data) }

  @Put('password')
  async changePassword(@Req() req: any): Promise<boolean> { return await this.usersService.changePassword(req.user._id, req.data) }

  private static readonly PROPS_LOGIN = ['mail', 'password'];
}
