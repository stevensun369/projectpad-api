import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async genToken(payload: {}): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async parseToken(token: string): Promise<{}> {
    return await this.jwtService.decode(token.split(' ')[1]);
  }
}
