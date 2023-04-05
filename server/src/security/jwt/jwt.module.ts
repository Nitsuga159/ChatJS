import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.service';

@Module({
  controllers: [],
  providers: [JwtStrategy],
  imports: [
    JwtModule.register({
      secret: String(process.env.JWT_SECRET),
    }),
  ],
})
export class JwtAuthModule {}
