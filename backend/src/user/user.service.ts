import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['emailDetails'],
    });
  }

  async create(email: string, username: string, hashedPassword: string) {
    const savedEmail = await this.emailService.create(email);

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      emailDetails: savedEmail,
    });

    return this.userRepository.save(user);
  }

  async updateUserByEmail(email: string, imageUrl: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException('User Not found!');

    user.image = imageUrl;
    return this.userRepository.save(user);
  }
}
