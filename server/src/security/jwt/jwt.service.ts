import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: [
        String(process.env.JWT_SECRET),
        String(process.env.JWT_SECRET_MAIL),
      ],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
