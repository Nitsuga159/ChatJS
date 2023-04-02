import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService, LocalStrategy } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt', // Estrategia de autenticación por defecto
      session: false, // Deshabilita el uso de sesiones
    }),
    JwtModule.register({
      secret: String(process.env.JWT_SECRET),
    }),
  ],
})
export class AuthModule {}
