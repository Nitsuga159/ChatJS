import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ChangePasswordType,
  FindUserResponse,
  LoginRequest,
  LoginResponseType,
  ROUNDS_ENCRYPT,
  UserType,
} from '../../database/user-model/user-model.type';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { UserDocument } from 'src/database/user-model/user-model';
import ENVS from 'src/envs';
import { Types } from 'mongoose';
import { Ws } from 'src/ws/ws.gateway';

const ObjectId = Types.ObjectId;

@Injectable()
export class UsersService {
  constructor(
    private readonly userModelService: UserModelService,
    private readonly ws: Ws,
  ) {}

  async create(user: UserType): Promise<UserDocument> {
    const createdUser = await this.userModelService.create(user);

    if (!createdUser) throw 'Failed to create user';

    return createdUser;
  }

  async login(data: LoginRequest): Promise<LoginResponseType> {
    const user: any = await this.findByOtherData({ mail: data.mail });

    if (!user) throw 'Invalid user';

    if (!(await compare(data.password, user.password)) && user.habilited)
      throw 'Invalid user';

    if (this.ws.isConnected(user._id)) throw 'User is already connected';

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
    if (this.ws.isConnected(_id)) throw 'User is already connected';

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
    const foundUser = await this.userModelService.findByOtherData(data);

    if (!foundUser) throw 'user not found';

    return foundUser;
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument> {
    const foundUser = await this.userModelService.findById(id);

    if (!foundUser) throw 'user not found';

    return foundUser;
  }

  async find(lastId: string): Promise<FindUserResponse> {
    const users = await this.userModelService.find(lastId);

    return {
      continue: users.length === UserModelService.PER_PAGE_USER,
      result: users,
    };
  }

  async update(id: string | Types.ObjectId, data: any): Promise<UserDocument> {
    if (!Object.values(data).length) throw 'No data to change';

    id = new ObjectId(id.toString());

    const updatedUser = (
      await this.userModelService.findByIdAndUpdate(id, data)
    ).toObject();

    delete updatedUser.password;
    delete updatedUser.__v;

    return updatedUser;
  }

  async changePassword(
    user: UserType,
    { password, newPassword }: ChangePasswordType,
  ): Promise<boolean> {
    const foundedUser = await this.userModelService.findById(user._id);

    if (!(await compare(password, foundedUser.password)))
      throw 'Invalid user to change data';

    foundedUser.password = await hash(newPassword, ROUNDS_ENCRYPT);

    await foundedUser.save();

    return true;
  }

  async findByUsername(
    username: string,
    lastId: string,
    userId: Types.ObjectId,
  ): Promise<{ result: UserDocument[]; continue: boolean }> {
    const result = await this.userModelService.findByUsername(
      username,
      lastId,
      userId,
    );

    return {
      result,
      continue: result.length === UserModelService.PER_PAGE_USER,
    };
  }
}
