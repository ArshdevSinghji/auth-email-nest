import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user.dto';
import { HashingService } from 'src/hashing/hashing.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private hashService: HashingService,
    private userService: UserService,
  ) {}

  async signIn(user: Partial<UserDto>) {
    if (!user.email || !user.password)
      throw new BadRequestException('user credentails are missing!');

    const foundUser = await this.userService.findOneByEmail(user.email);

    if (!foundUser) throw new BadRequestException('User not found');

    const isMatch = await this.hashService.confirmation(
      user.password,
      foundUser.password,
    );

    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const payload = { email: user.email, username: user.username };

    return {
      foundUser,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(user: UserDto) {
    const existingUser = await this.userService.findOneByEmail(user.email);

    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashService.generateHash(user.password);

    return this.userService.create(user.email, user.username, hashedPassword);
  }
}
