import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => dataSourceOptions,
    }),
    AuthModule,
    MailModule,
    EmailModule,
  ],
})
export class AppModule {}
