import { Controller, Param, Post } from '@nestjs/common';
import { MailService } from './mail.provider';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(':email')
  async sendMail(@Param('email') email: string) {
    return this.mailService.sendMail(email);
  }
}
