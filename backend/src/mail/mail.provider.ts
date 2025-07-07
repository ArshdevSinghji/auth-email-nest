import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class MailService {
  constructor(
    private mailService: MailerService,
    private emailService: EmailService,
  ) {}

  async generateCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000);
    await this.emailService.genenerateCode(email, code);
    return code;
  }

  async sendMail(email: string) {
    return this.mailService.sendMail({
      to: 'arshdevrajput20@gmail.com',
      subject: 'OTP - One Time Password',
      template: './otp',
      context: {
        username: 'John Snow',
        otpCode: await this.generateCode(email),
        expiryMinutes: 10,
        companyName: 'YourApp',
      },
    });
  }
}
