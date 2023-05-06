import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ChangePasswordType,
  FindUserResponse,
  LoginRequest,
  LoginResponseType,
  PER_PAGE_USER,
  ROUNDS_ENCRYPT,
  UserType,
} from '../../database/user-model/user-model.type';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { UserDocument } from 'src/database/user-model/user-model';
import ENVS from 'src/envs';
import { Types } from 'mongoose';

const ObjectId = Types.ObjectId;

@Injectable()
export class UsersService {
  constructor(private readonly userService: UserModelService) {}

  async create(user: UserType): Promise<UserDocument> {
    const createdUser = await this.userService.create(user);

    if (!createdUser) throw 'Failed to create user';

    return createdUser;
  }

  async login(data: LoginRequest): Promise<LoginResponseType> {
    const user: any = await this.findByOtherData({ username: data.username });

    if (!user) throw 'Invalid user';

    if (!(await compare(data.password, user.password)) && user.habilited)
      throw 'Invalid user';

    const { username, mail, color, photo, _id } = user;
    return {
      username,
      mail,
      color,
      photo,
      _id,
      accessToken: sign({ _id }, ENVS.JWT_USER_SECRET),
    };
  }

  async loginToken({
    username,
    mail,
    color,
    photo,
    _id,
  }: any): Promise<LoginResponseType> {
    return {
      username,
      mail,
      color,
      photo,
      _id,
      accessToken: sign({ _id }, ENVS.JWT_USER_SECRET),
    };
  }

  async findByOtherData(data: any): Promise<UserDocument> {
    const foundUser = await this.userService.findByOtherData(data);

    if (!foundUser) throw 'user not found';

    return foundUser;
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument> {
    const foundUser = await this.userService.findById(id);

    if (!foundUser) throw 'user not found';

    return foundUser;
  }

  async find(page: number): Promise<FindUserResponse> {
    page = isNaN(+page) || +page < 1 ? 0 : page - 1;

    const users = await this.userService.find(page);

    return {
      continue: users.length === PER_PAGE_USER,
      result: users,
    };
  }

  async update(id: string | Types.ObjectId, data: any): Promise<UserDocument> {
    if (!Object.values(data).length) throw 'No data to change';

    id = new ObjectId(id.toString());

    const updatedUser = (
      await this.userService.findByIdAndUpdate(id, data)
    ).toObject();

    delete updatedUser.password;
    delete updatedUser.__v;

    return updatedUser;
  }

  async changePassword(
    user: UserType,
    { password, newPassword }: ChangePasswordType,
  ): Promise<boolean> {
    const foundedUser = await this.userService.findById(user._id);

    if (!(await compare(password, foundedUser.password)))
      throw 'Invalid user to change data';

    foundedUser.password = await hash(newPassword, ROUNDS_ENCRYPT);

    await foundedUser.save();

    return true;
  }

  async findByUsername(
    username: string,
    userId: Types.ObjectId,
  ): Promise<UserDocument[]> {
    return await this.userService.findByUsername(username, userId);
  }
}
