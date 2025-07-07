import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async generateHash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async confirmation(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
