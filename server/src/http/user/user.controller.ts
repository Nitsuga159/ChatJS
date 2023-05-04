import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User, UserDocument } from '../../database/user-model/user-model';
import { JwtMailCodeMiddleware } from 'src/middlewares/jwt-code/jwt-code.middleware';
import validateProps from 'src/middlewares/validate-props/validateProps.middleware';
import {
  FindUserResponse,
  LoginResponseType,
  PROPS_LOGIN,
  PROPS_UPDATE_USER,
  UserType,
} from '../../database/user-model/user-model.type';
import { UserMiddleware } from '../../database/user-model/user-model.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':page')
  @UseGuards(UserMiddleware)
  findUsers(@Param('page') page: string): Promise<FindUserResponse> {
    try {
      return this.usersService.find(+page);
    } catch (e) {
      throw new HttpException(
        `Error finding users: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('login-token')
  @UseGuards(UserMiddleware)
  async loginToken(@Req() req: any): Promise<LoginResponseType> {
    try {
      return await this.usersService.loginToken(req.data);
    } catch (e) {
      throw new HttpException(
        `Error to login with token: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @UseGuards(validateProps(PROPS_LOGIN, 'body', true))
  async login(@Req() req: any): Promise<LoginResponseType> {
    try {
      return this.usersService.login(req.data);
    } catch (e) {
      throw new HttpException(`Error to login: ${e}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @UseGuards(JwtMailCodeMiddleware)
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: UserType): Promise<UserDocument> {
    try {
      return await this.usersService.create(user);
    } catch (e: any) {
      throw new HttpException(
        `Error to create user: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('update')
  @UseGuards(UserMiddleware)
  @UseGuards(validateProps(PROPS_UPDATE_USER, 'query', false))
  async update(@Req() req: any): Promise<UserDocument> {
    try {
      return await this.usersService.update(req.user._id, req.data);
    } catch (e: any) {
      throw new HttpException(
        `Error to update user: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('password')
  async changePassword(@Req() req: any): Promise<boolean> {
    try {
      return await this.usersService.changePassword(req.user._id, req.data);
    } catch (e: any) {
      throw new HttpException(
        `Error to change password: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
