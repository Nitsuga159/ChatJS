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
    const findUser = this.userModel.findOne({ mail: user.mail }).exec();

    if (findUser)
      throw new HttpException(
        'There is a user with those email',
        HttpStatus.BAD_REQUEST,
      );

    const createdUser = new this.userModel({
      ...user,
      password: await hash(user.password, 10),
      habilited: true,
    });

    return await createdUser.save();
  }

  async foundUser(data: {
    mail?: string;
    username?: string;
  }): Promise<User | null> {
    if (!data.mail && !data.username) return null;

    const user = await this.userModel
      .findOne(data)
      .select('username password mail habilited connected photo color')
      .exec();

    return user ? user.toObject() : null;
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
