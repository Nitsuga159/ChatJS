import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CodeVerification,
  CodeVerificationDocument,
} from './code-verification.model';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CodeVerificationService {
  constructor(
    @InjectModel(CodeVerification.name)
    private readonly codeVerificationModel: Model<CodeVerificationDocument>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async createCode(mail: string): Promise<boolean> {
    // generate a random number with 6
    const code = Math.floor(Math.random() * 900000) + 100000;
    const filter = { mail };
    const update = { code };

    // return the updated document if it exits or creates a new document with its properties
    const options = { new: true, upsert: true };

    await this.codeVerificationModel
      .findOneAndUpdate(filter, update, options)
      .exec();

    await this.mailService.sendEmail(
      mail,
      'code',
      `<h1>Your code is</h1><p>${code}</p>`,
    );

    return true;
  }

  async correctCode(data: {
    mail: string;
    code: number;
  }): Promise<string | null> {
    if (!data.code || !data.mail) return null;

    const { deletedCount } = await this.codeVerificationModel
      .deleteOne(data)
      .exec();

    return deletedCount !== 0
      ? this.jwtService.sign(
          { mail: data.mail },
          { secret: String(process.env.JWT_SECRET_MAIL) },
        )
      : null;
  }
}
