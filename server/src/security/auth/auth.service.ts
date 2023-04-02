import { Strategy as LocalStrategyPassport } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ username: string; password: string }> {
    if (username === 'agus' && password === '1234') {
      return { username, password };
    }

    return null;
  }

  async login(user: any) {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(LocalStrategyPassport) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Usuario inválido',
        statusCode: 401,
      });
    }
    return user;
  }
}
