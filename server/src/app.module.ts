import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './security/auth/auth.module';
import { JwtAuthModule } from './security/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule, AuthModule, DatabaseModule],
  providers: [],
})
export class AppModule {}
