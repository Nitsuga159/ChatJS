import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.model';
import { JwtMiddleware } from 'src/middlewares/jwt/jwt.middleware';
import { JwtMailCodeMiddleware } from 'src/middlewares/jwt/jwt-code.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':page')
  @UseGuards(JwtMiddleware)
  findUsers(@Param('page') page: string) {
    return this.usersService.findUsers(+page);
  }

  @Post('login')
  async login(@Req() req: any) {
    return req.user;
  }

  @Post()
  @UseGuards(JwtMailCodeMiddleware)
  @UsePipes(new ValidationPipe())
  async createUser(@Body() user: User) {
    return this.usersService.create(user);
  }
}
