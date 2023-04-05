import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.model';
import { JwtMailCodeMiddleware } from 'src/middlewares/jwt.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtMailCodeMiddleware)
  async createUser(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get(':page')
  findUsers(@Param('page') page: string) {
    return this.usersService.findUsers(+page);
  }
}
