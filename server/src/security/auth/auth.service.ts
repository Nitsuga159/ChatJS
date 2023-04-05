import { Strategy as LocalStrategyPassport } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/database/user/user.service';
import { User } from 'src/types/user.type';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const userFounded: User | null = (await this.userService.foundUser(
      username,
    )) as User;

    if (!userFounded) return null;

    if (!(await compare(password, userFounded.password))) return null;

    delete userFounded.password;

    return userFounded;
  }

  async login(user: User) {
    return {
      ...user,
      accessToken: this.jwtService.sign(
        { _id: user._id },
        { secret: String(process.env.JWT_SECRET) },
      ),
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
        message: 'Invalid user',
        statusCode: 401,
      });
    }
    return user;
  }
}
