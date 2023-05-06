import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import ENVS from 'src/envs';

@Injectable()
export class MailService {
  private transporter: Mail;

  constructor() {
    this.transporter = createTransport({
      // Configura tus credenciales de email y SMTP aquí
      service: 'gmail',
      auth: {
        user: ENVS.MAIL_ADDRESS,
        pass: ENVS.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      to,
      subject,
      html,
    });
  }
}
