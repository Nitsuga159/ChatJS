import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { UserModelModule } from 'src/database/user-model/user-model.module';
import { CodeVerificationModelModule } from 'src/database/code-verification-model/code-verification-model.module';
import { WsModule } from 'src/ws/ws.module';
import fieldsQuery from 'src/middlewares/fieldsQuery/fieldsQuery.middleware';
import { USER_ENDPOINTS } from './user.config';

@Module({
  imports: [UserModelModule, CodeVerificationModelModule, WsModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      fieldsQuery({ 
        allFields: ['_id', 'mail', 'username', 'userType', 'description', 'photo', 'color'], 
        fieldsToOmitDefault: ['password', '__v', 'habilited'] 
      }))
      .exclude(USER_ENDPOINTS.CHANGE_PASSWORD)
      .forRoutes('/user/*',)
  }
}
