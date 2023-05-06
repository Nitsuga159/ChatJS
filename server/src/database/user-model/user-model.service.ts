import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user-model';
import { Model, Types } from 'mongoose';
import { PER_PAGE_USER, ROUNDS_ENCRYPT, UserType } from './user-model.type';
import { hash } from 'bcrypt';

@Injectable()
export class UserModelService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: UserType): Promise<UserDocument | null> {
    const foundUser = await this.findByOtherData({
      mail: user.mail,
    });

    if (foundUser) return null;

    const createdUser = new this.userModel({
      ...user,
      password: await hash(user.password, ROUNDS_ENCRYPT),
      habilited: true,
    });

    return await createdUser.save();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return await this.userModel.findById(id, {
      __v: 0,
      password: 0,
    });
  }

  async findByIdAndUpdate(
    id: string | Types.ObjectId,
    data: UserType,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async findByOtherData(data: any): Promise<UserDocument | null> {
    return await this.userModel.findOne(data).exec();
  }

  async find(page: number): Promise<UserDocument[]> {
    const skip = page * PER_PAGE_USER;

    return await this.userModel
      .find({}, { password: 0, __v: 0 })
      .skip(skip)
      .limit(PER_PAGE_USER)
      .exec();
  }

  async findByUsername(
    username: string,
    userId: Types.ObjectId,
  ): Promise<UserDocument[]> {
    return await this.userModel
      .find(
        {
          habilited: true,
          _id: { $nin: userId },
          username: { $regex: new RegExp(`^${username}`, 'i') },
        },
        { __v: 0, habilited: 0, password: 0 },
      )
      .limit(10)
      .exec();
  }
}
