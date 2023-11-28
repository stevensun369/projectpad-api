import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/account.schema';
import AccountDTO from './account.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    private jwtService: JwtService,
  ) {}

  async genToken(payload: {}): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async check(email: string): Promise<boolean> {
    const account = await this.accountModel.exists({
      email: email,
    });

    return account !== null;
  }

  async create(accountDTO: AccountDTO) {
    const createdAccount = new this.accountModel(accountDTO);

    await createdAccount.save();
  }
}
