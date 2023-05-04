import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';

@Module({
  imports: [UserModelModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
