import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { CodeVerificationModelModule } from 'src/database/code-verification-model/code-verification-model.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [UserModelModule, CodeVerificationModelModule, WsModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}