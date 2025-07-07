import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() user: UserDto) {
    return this.authService.signUp(user);
  }

  @Post('signIn')
  async signIn(@Body() user: Partial<UserDto>) {
    return this.authService.signIn(user);
  }
}
