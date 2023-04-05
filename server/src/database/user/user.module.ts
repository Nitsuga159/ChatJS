import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtMailCodeMiddleware } from 'src/middlewares/jwt.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    // Registra tu middleware aquí
    consumer
      .apply(JwtMailCodeMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.POST });
  }
}
