import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { CodeVerificationModelModule } from 'src/database/code-verification-model/code-verification-model.module';

@Module({
  imports: [UserModelModule, CodeVerificationModelModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
