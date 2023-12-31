import { Body, Controller, Delete, Get, Headers, HttpCode, HttpException, Param, Patch, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Account } from 'src/schemas/account.schema';
import { AccountService } from './account.service';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtService } from '@nestjs/jwt';

@Controller('account')
export class AccountController {

  constructor(
    private accountService: AccountService, 
    private authService: AuthService, 
    private jwtService: JwtService,
  ) {}

  @Put('')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changeAccount(
    @Headers('authorization') authToken: string, 
    @Body() body: {
        firstName: string, lastName: string, 
        phone: string, bio: string
      },
  ): Promise<{}> {
    const localAccount =
      await this.authService.parseToken(authToken);

    const account = await this.accountService.change(
      {email: localAccount['email']},
      {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        bio: body.bio,
      }
    )


    return {
      account: account,
      token: this.jwtService.sign(account),
    }
  }

  @Put('/links')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async addLink(
    @Headers('authorization') authToken: string, 
    @Body() body: {platform: string, handle: string},
  ): Promise<Account> {
    const localAccount =
      await this.authService.parseToken(authToken);

    const account = await this.accountService.changeField(
      {email: localAccount.email},
      `links.${body.platform}`, body.handle
    )

    account.links[body.platform] = body.handle

    return account;
  }

  @Delete('/links')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async deleteLink(
    @Headers('authorization') authToken: string, 
    @Body() body: {platform: string},
  ): Promise<Account> {
    const localAccount =
      await this.authService.parseToken(authToken);

    const account = await this.accountService.changeField(
      {email: localAccount.email},
      `links.${body.platform}`, ''
    )

    account.links[body.platform] = ''

    return account;
  }

  async getToken(authToken: string): Promise<Account> {
    return await this.authService.parseToken(authToken);
  }

  @Patch('/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      async filename(req, file, callback) {
        console.log(req);
        callback(null, req.query.file + '.jpg');
      },
      destination(req, file, callback) {
        callback(null, './files/profile');
      },
    }),
  }))
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async addImage(
    @Headers('authorization') authToken: string, 
    @UploadedFile() file: Express.Multer.File
  ): Promise<string> {
    return 'ok';
  }
  
  @Patch('/:field')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changeField(
    @Headers('authorization') authToken: string, 
    @Body() body: {
        firstName: string, lastName: string, 
        phone: string, slug: string, bio: string
      },
    @Param() params: {field: string},
  ): Promise<{}> {
    const localAccount =
      await this.authService.parseToken(authToken);

    if (params.field == 'slug') {
      const check = await this.accountService.check(
        {'slug': body.slug}
      )
      
      if (check) {
        throw new HttpException(
          {'message': "Un utilizator cu acest link exista deja"},
          500
        )
      }
    }

    const account = await this.accountService.changeField(
      {email: localAccount['email']},
      params.field, body[params.field]
    )

    return {
      account: account,
      token: this.jwtService.sign(account),
    };
  }

  @Get('/slug/:slug')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async checkSlug(
    @Param() params: {slug: string},
  ): Promise<string> {
    const check = await this.accountService.check(
      {'slug': params.slug}
    )
    
    if (check) {
      throw new HttpException(
        {'message': "Already being used :("},
        500
      )
    }

    return 'ok';
  }
}
