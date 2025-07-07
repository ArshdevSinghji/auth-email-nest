import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.provider';
import { MailController } from './mail.controller';
import { EmailModule } from 'src/email/email.module';

config();

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"OTP" <${process.env.EMAIL_USERNAME}>`,
        },
        preview: true,
        template: {
          dir: join(process.cwd(), 'src', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    EmailModule,
  ],
  providers: [MailService],
  controllers: [MailController],
})
export class MailModule {}
