import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/schemas/account.schema';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async genTempToken(payload: {}): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async genToken(payload: Account): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async parseToken(token: string): Promise<{}> {
    return await this.jwtService.decode(token.split(' ')[1]);
  }
}
