import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import {
  ChangePasswordType,
  FindUserResponse,
  LoginRequest,
  ROUNDS_ENCRYPT,
  UserRequest,
} from '../../database/user-model/user-model.type';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { UserDocument } from 'src/database/user-model/user-model';
import ENVS from 'src/envs';
import { Types } from 'mongoose';
import { Ws } from 'src/ws/ws.gateway';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import * as ERRORS from 'src/errors-message.';

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
      throw new DefaultHttpException({ status: HttpStatus.CONFLICT, message: ERRORS.UNEXPECTED })
    }
    
    return createdUser;
  }
  
  async login(data: LoginRequest) {
    Logger.log(`start with data ${JSON.stringify(data)}`, "login")

    const user: any = await this.findByOtherData({ mail: data.mail });

    if (!(await compare(data.password, user.password)) && user.habilited) {
      throw new DefaultHttpException({ status: HttpStatus.UNAUTHORIZED, message: ERRORS.UNATHORIZED })
    }

    const { _id } = user;
    
    const response  = { accessToken: sign({ _id }, ENVS.JWT_USER_SECRET) }
    
    Logger.log(`access_token: ${JSON.stringify(response)}`, 'Login')
    
    return response
  }
  
  async findByOtherData(data: any): Promise<UserDocument> {
    const foundUser = await this.userModelService.findByOtherData(data);
    
    if (!foundUser) {
      throw new DefaultHttpException({ status: HttpStatus.UNAUTHORIZED, message: ERRORS.UNATHORIZED });
    }
    
    return foundUser;
  }
  
  async findById(id: string | Types.ObjectId, fields: {} = {}): Promise<UserDocument> {
    Logger.log(`start with id ${id}`, "find user")

    
    const foundUser = (await this.userModelService.findById(id, fields)).toObject({ useProjection: true });
    
    Logger.log(`sending user ${JSON.stringify(foundUser)}`, "find user")

    return foundUser;
  }
  
  async find(lastId: Types.ObjectId, _fields: {} = {}): Promise<FindUserResponse> {
    const users = await this.userModelService.find(lastId, _fields);
    
    return {
      continue: users.length === UserModelService.PER_PAGE_USER,
      result: users,
    };
  }

  async update(id: string | Types.ObjectId, data: any, fields: {} = {}): Promise<UserDocument> {
    if (!Object.values(data).length) {
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: ERRORS.REQUEST_DATA })
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
      throw new DefaultHttpException({ status: HttpStatus.BAD_REQUEST, message: ERRORS.REQUEST_DATA })
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
