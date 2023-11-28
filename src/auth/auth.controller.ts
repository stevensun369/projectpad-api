import { Body, Controller, Get, Headers, HttpCode, HttpException, Inject, Post, UseGuards } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import AccountDTO from '../schemas/account.dto';
import { genCode, genID } from 'src/helpers/gen';
import { sendEmail } from 'src/helpers/email';
import * as bcrypt from 'bcrypt';
import { rounds } from 'src/env';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private accountService: AccountService, 
    private authService: AuthService, 

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
      token: await this.authService.genToken(payload),
    }
  }

  @Post('/signup/basic')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async signupBasic(@Headers('authorization') authToken: string, @Body() accountDTO: AccountDTO): Promise<{}> {
    const account =
      await this.authService.parseToken(authToken);

    accountDTO.ID = genID(10);
    accountDTO.slug = accountDTO.ID
    accountDTO.password = await bcrypt.hash(accountDTO.password, rounds);
    accountDTO.email = account['email'];


    await this.accountService.create(accountDTO);

    const token = await this.authService.genToken(accountDTO);

    return {
      token: token,
      account: accountDTO,
    }
  }
  
  @Post('/login/email')
  @HttpCode(200)
  async loginEmail(@Body() body: {email: string}): Promise<{}> {
    const check = await this.accountService.check(body.email);

    if (!check) {
      throw new HttpException({
        message: 'Un utilizator cu acest email nu exista',
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

  @Post('/login/verify')
  @HttpCode(200)
  async loginVerify(@Body() body: {email: string, code: string}): Promise<{}> {

    const hashed = await this.cacheManager.get(`code:${body.email}`);
    const check = await bcrypt.compare(body.code, hashed.toString());

    if (!check) {
      throw new HttpException({
        message: 'Codul este gresit',
      }, 500);
    }

    const payload = {email: body.email};

    return {
      token: await this.authService.genToken(payload),
    }
  }

  @Post('/login/password')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async login(@Headers('authorization') authToken: string, @Body() body: {password: string}): Promise<{}> {
    const localAccount =
      await this.authService.parseToken(authToken);
    
    const account = 
      await this.accountService.getOne(
        {email: localAccount['email']}
      );

    const check = await bcrypt.compare(body.password, account['password']);
    if (!check) {
      throw new HttpException({
        "message": "parola gresita"
      }, 500);
    }

    const token = await this.authService.genToken(account);

    return {
      token: token,
      account: account,
    }
  }
}
