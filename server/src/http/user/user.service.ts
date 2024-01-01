import { HttpStatus, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ChangePasswordType,
  FindUserResponse,
  LoginRequest,
  ROUNDS_ENCRYPT,
  UserRequest,
  UserType,
} from '../../database/user-model/user-model.type';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { UserDocument } from 'src/database/user-model/user-model';
import ENVS from 'src/envs';
import { Types } from 'mongoose';
import { Ws } from 'src/ws/ws.gateway';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import filterObject from 'src/utils/filterObject';

const ObjectId = Types.ObjectId;

@Injectable()
export class UsersService {
  constructor(
    private readonly userModelService: UserModelService,
    private readonly ws: Ws,
  ) {}

  async create(user: UserRequest): Promise<UserDocument> {
    const createdUser = await this.userModelService.create(user);

    if (!createdUser) {
      throw new DefaultHttpException({ status: HttpStatus.CONFLICT, message: 'Failed to create user' })
    }

    return createdUser;
  }

  async login(data: LoginRequest) {

    const user: any = await this.findByOtherData({ mail: data.mail });

    if (!(await compare(data.password, user.password)) && user.habilited) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid User' })
    }

    if (this.ws.isConnected(user._id)) throw 'User is already connected';

    const { _id } = user;

    return { accessToken: sign({ _id }, ENVS.JWT_USER_SECRET) }
  }

  async loginToken({
    username,
    mail,
    color,
    photo,
    _id,
  }: any) {
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

    if (!foundUser) throw new DefaultHttpException({ status: 400, message: 'Invalid credencials' });

    return foundUser;
  }

  async findById(id: string | Types.ObjectId, fields: {} = {}): Promise<UserDocument> {
    const foundUser = await this.userModelService.findById(id, fields);

    return foundUser;
  }

  async find(lastId: string, _fields: {} = {}): Promise<FindUserResponse> {
    const users = await this.userModelService.find(lastId, _fields);

    return {
      continue: users.length === UserModelService.PER_PAGE_USER,
      result: users,
    };
  }

  async update(id: string | Types.ObjectId, data: any, fields: {} = {}): Promise<UserDocument> {
    if (!Object.values(data).length) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: 'Invalid data' })
    }

    id = new ObjectId(id.toString());

    const updatedUser = (
      await this.userModelService.findByIdAndUpdate(id, data, fields)
    ).toObject();

    return updatedUser;
  }

  async changePassword(
    _id: string,
    { password, newPassword }: ChangePasswordType,
  ): Promise<boolean> {
    const foundedUser = await this.userModelService.findById(_id);

    if (!(await compare(password, foundedUser.password))) {
      throw new DefaultHttpException({ status: HttpStatus.NOT_ACCEPTABLE, message: 'Invalid password' })
    }
    
    foundedUser.password = await hash(newPassword, ROUNDS_ENCRYPT);

    await foundedUser.save();

    return true;
  }

  async findByUsername(
    username: string,
    lastId: string,
    userId: Types.ObjectId,
    fields: {} = {}
  ): Promise<{ users: UserDocument[]; continue: boolean }> {
    const users = await this.userModelService.findByUsername(
      username,
      lastId,
      userId,
      fields
    );

    return {
      users,
      continue: users.length === UserModelService.PER_PAGE_USER,
    };
  }
}
