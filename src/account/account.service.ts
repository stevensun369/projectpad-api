import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from 'src/schemas/account.schema';
import AccountDTO from '../schemas/account.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async check(query: {}): Promise<boolean> {
    const account = await this.accountModel.exists(query);

    return account !== null;
  }

  async create(accountDTO: AccountDTO) {
    const createdAccount = new this.accountModel(accountDTO);

    await createdAccount.save();
  }

  async getOne(query: {}): Promise<Account> {
    let account = {};
    try {
      account = await this.accountModel.findOne(query);
    } catch (err) {
      throw new HttpException(
        {'message': 'eroare de sistem'},
        500
      );
    }

    if (account == null)
        throw new HttpException(
          {'message': "Nu exista cont cu acest email"},
          500
        );

    return new Account(account);
  }

  async changeField(query: {}, field: string, value: any): Promise<Account> {
    let account = {};

    let modify = {
      $set: {},
    };
    modify.$set[field] = value;

    try {
      account = await this.accountModel.findOneAndUpdate(
        query,
        modify,
      );
    } catch (err) {
      throw new HttpException(
        {'message': 'eroare de sistem'},
        500
      );
    }

    account[field] = value;

    return new Account(account);
  }
}
