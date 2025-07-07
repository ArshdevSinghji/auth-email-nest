import { Controller, Param, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post(':email')
  async updateVerfiy(@Param('email') email: string) {
    return await this.emailService.updateVerfiy(email);
  }
}
