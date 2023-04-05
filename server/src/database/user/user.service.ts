import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel({
      ...user,
      password: await hash(user.password, 10),
      habilited: true,
    });

    return await createdUser.save();
  }

  async foundUser(username: string): Promise<User | null> {
    return (
      await this.userModel
        .findOne({ username })
        .select('username password mail habilited connected photo')
        .exec()
    ).toObject();
  }

  async findUsers(page: number): Promise<User[]> {
    if (page < 1)
      throw new HttpException(
        'The current page cannot be a number less than 1',
        HttpStatus.BAD_REQUEST,
      );

    return this.userModel
      .find()
      .skip(page - 1)
      .limit(15)
      .exec();
  }
}
