import { Module } from '@nestjs/common';
import { AuthModule } from './security/auth/auth.module';
import { JwtAuthModule } from './security/jwt/jwt.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [JwtAuthModule, AuthModule, DatabaseModule],
  providers: [],
})
export class AppModule {}
