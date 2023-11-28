import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import AccountDTO from './account.dto';
import { genCode } from 'src/helpers/gen';
import { sendEmail } from 'src/helpers/email';
import * as bcrypt from 'bcrypt';
import { rounds } from 'src/env';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('account')
export class AccountController {

  constructor(
    private accountService: AccountService, 
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  
  @Get('/test')
  test(): string {
    return 'test'
  }

  @Post('/signup/email')
  @HttpCode(200)
  async signupEmail(@Body() body: {email: string}): Promise<{}> {
    const check = await this.accountService.check(body.email);

    if (check) {
      throw new HttpException({
        message: 'Un utilizator cu acest email exista deja',
      }, 500);
    }   
    const code = genCode(6);
      
    try {
      await sendEmail(body.email, code);
    } catch {
      throw new HttpException({
        message: 'Codul nu a putut fi trimis pe email',
      }, 500);
    }

    const hashedCode = await bcrypt.hash(code, rounds);

    try {
      await this.cacheManager.set(`code:${body.email}`, hashedCode);
    } catch (err) {
      throw new HttpException({
        message: err,
      }, 500);
    }

    return {
      email: body.email,
      code: code,
    };
  }

  @Post('/signup/verify')
  @HttpCode(200)
  async signupVerify(@Body() body: {email: string, code: string}): Promise<{}> {

    const hashed = await this.cacheManager.get(`code:${body.email}`);
    const check = await bcrypt.compare(body.code, hashed.toString());

    if (!check) {
      throw new HttpException({
        message: 'Codul este gresit',
      }, 500);
    }

    const payload = {email: body.email};

    return {
      token: await this.accountService.genToken(payload),
    }
  }

  @Post('/signup/basic')
  @HttpCode(200)
  signupBasic(@Body() accountDTO: AccountDTO): string {
    this.accountService.create(accountDTO);

    return 'ok'
  }

}
