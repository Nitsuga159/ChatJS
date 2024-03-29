import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CodeVerification,
  CodeVerificationDocument,
} from '../../database/code-verification-model/code-verification-model';
import { MailService } from 'src/mail/mail.service';
import { User } from '../../database/user-model/user-model';
import { UserModelService } from 'src/database/user-model/user-model.service';
import { sign } from 'jsonwebtoken';
import ENVS from 'src/envs';
import { DefaultHttpException } from 'src/exceptions/DefaultHttpException';
import ServerLogger from 'src/utils/logger';

@Injectable()
export class CodeVerificationService {
  constructor(
    @InjectModel(CodeVerification.name)
    private readonly codeVerificationModel: Model<CodeVerificationDocument>,
    private readonly userService: UserModelService,
    private readonly mailService: MailService,
  ) {}

  async create({ mail }: { mail: string }): Promise<boolean> {
    const findUser: User | null = await this.userService.findByOtherData({
      mail,
    })

    if (findUser) {
      throw new DefaultHttpException({ status: HttpStatus.CONFLICT, message: 'The user is already registered' })
    }

    // generate a random number with 6
    const code = Math.floor(Math.random() * 900000) + 100000;
    const filter = { mail }
    const update = { code }

    // return the updated document if it exits or creates a new document with its properties
    const options = { new: true, upsert: true }

    await this.codeVerificationModel
      .findOneAndUpdate(filter, update, options)
      .exec();

    await this.mailService.sendEmail(
      mail,
      'code',
      `<h1>Your code is</h1><p>${code}</p>`,
    )

    return true;
  }

  async verify(data: { mail: string; code: number }): Promise<{ accessToken: string }> {   
    const { deletedCount } = await this.codeVerificationModel
    .deleteOne(data)
    .exec();

    if(deletedCount === 0) {
      throw new DefaultHttpException({ status: HttpStatus.CONFLICT, message: 'Invalid coute', results: { success: false } })
    }

    return { accessToken: sign({}, ENVS.JWT_MAIL_SECRET, { expiresIn: 300 }) }
  }

  private readonly logger = new ServerLogger(CodeVerificationService.name)
}
