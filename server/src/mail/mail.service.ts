import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private transporter: Mail;

  constructor() {
    this.transporter = createTransport({
      // Configura tus credenciales de email y SMTP aquí
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ADDRESS as string,
        pass: process.env.MAIL_PASSWORD as string,
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
