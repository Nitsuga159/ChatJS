import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user-model';
import { Model, Types } from 'mongoose';
import { ROUNDS_ENCRYPT, UserRequest, UserType } from './user-model.type';
import { hash } from 'bcrypt';
import CONSTANS from 'src/constants';
import filterObject from 'src/utils/filterObject';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';

@Injectable()
export class UserModelService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public static readonly PER_PAGE_USER = 10;

  async create(user: UserRequest): Promise<UserDocument | null> {
    const foundUser = await this.findByOtherData({
      mail: user.mail,
    })

    if (foundUser) {
      return null
    }

    const createdUser = new this.userModel({
      ...user,
      userType: new Types.ObjectId(CONSTANS.USER_TYPES.USER_ID),
      password: await hash(user.password, ROUNDS_ENCRYPT),
      habilited: true,
    })

    const createdObjectUser = (await (await createdUser.save()).populate('userType')).toObject()

    filterObject(createdObjectUser, 'password', '__v')
    
    return createdObjectUser
  }

  async findById(id: string | Types.ObjectId, fields: {} = {}): Promise<UserDocument | null> {
    const user = await this.userModel.findById(
      id, fields
    ).populate('userType')

    if(!user) {
      throw new DefaultHttpException({ status: HttpStatus.UNAUTHORIZED, message: 'Invalid user' })
    }

    return user
  }

  async findByIdAndUpdate(
    id: string | Types.ObjectId,
    data: UserType,
    fields: {} = {}
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, data, { new: true, projection: fields })
      .exec();
  }

  async findByOtherData(data: any, fields: {} = {}): Promise<UserDocument | null> {
    return await this.userModel.findOne(data, fields ).exec();
  }

  async find(lastId: string, fields: {} = {}): Promise<UserDocument[]> {
    let query = this.userModel
      .find({}, fields)
      .populate('userType')
      .sort({ _id: 1 });

    if (lastId) {
      query = query.where('_id').gt(new Types.ObjectId(lastId) as any);
    }

    return await query.limit(UserModelService.PER_PAGE_USER).exec();
  }

  async findByUsername(
    username: string,
    lastUserId: string,
    userId: Types.ObjectId,
    fields: {} = {}
  ): Promise<UserDocument[]> {
    let query = this.userModel.find(
      {
        habilited: true,
        _id: { $nin: userId },
        username: { $regex: new RegExp(`${username}`, 'i') },
      },
      fields,
    );

    if (lastUserId) {
      query = query.where('_id').gt(new Types.ObjectId(lastUserId) as any);
    }

    return await query.limit(UserModelService.PER_PAGE_USER).exec();
  }
}
