import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Put()
  async updateUserById(@Body() user: { email: string; imageURL: string }) {
    return this.userService.updateUserByEmail(user.email, user.imageURL);
  }
}
