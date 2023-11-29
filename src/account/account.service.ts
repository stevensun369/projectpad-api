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

    return {
      ID: account['ID'],
      email: account['email'],
      phone: account['phone'],
      firstName: account['firstName'],
      lastName: account['lastName'],
      links: account['links'],
      slug: account['slug'],
      bio: account['bio,'],
      password: account['password'],
    };
  }
}
