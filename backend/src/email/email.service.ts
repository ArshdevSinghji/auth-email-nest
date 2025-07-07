import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from 'src/entity/email.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(Email)
    private emailRepo: Repository<Email>,
  ) {}

  async genenerateCode(email: string, code: number) {
    const user = await this.emailRepo.findOne({
      where: { email: email },
    });
    if (!user) throw new BadRequestException('User not Found!');
    user.verificationCode = code;
    await this.emailRepo.save(user);
  }

  async updateVerfiy(email: string) {
    const user = await this.emailRepo.findOne({
      where: { email: email },
    });
    if (!user) throw new BadRequestException('User not Found!');
    user.isVerified = true;
    await this.emailRepo.save(user);
  }

  async create(email: string) {
    const emailEntity = this.emailRepo.create({
      email,
      isVerified: false,
    });

    return await this.emailRepo.save(emailEntity);
  }
}
