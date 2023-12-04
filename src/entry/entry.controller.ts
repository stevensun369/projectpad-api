import { Body, Controller, Post, HttpCode, Param, Headers, UseGuards, Patch, Get, Put, HttpException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Entry } from 'src/schemas/entry.schema';
import { EntryService } from './entry.service';
import { genID } from 'src/helpers/gen';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('entry')
export class EntryController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private entryService: EntryService,
  ) {}

  @Post('')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async createEntry(
    @Headers('authorization') authToken: string,
    @Body() entry: Entry,
  ) : Promise<Entry> {
    const localAccount = 
      await this.authService.parseToken(authToken);

    entry.accountID = localAccount.ID;
    entry.ID = genID(12);
    entry.createdAt = new Date();
    await this.entryService.create(entry);

    return entry;
  }

  @Get('')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getEntries(
    @Headers('authorization') authToken: string
  ) : Promise<Entry[]> {
    const localAccount = 
      await this.authService.parseToken(authToken);

    let entries: Entry[];
    try {
      entries = await this.entryService.get(localAccount.ID);
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      )
    }

    return entries;
  }

  @Patch('/:entryID/:field')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changeEntryField(
    @Body() body: {
      title: string, description: string,
      customerLink: string, hidden: boolean,
      order: number
    },
    @Param() params: {entryID: string, field: string},
  ) : Promise<Entry> {
    let entry: Entry;
    try {
      entry = await this.entryService.changeField(
        params.entryID,
        params.field,
        body[params.field]
      )
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      );
    }

    return entry;
  }

  @Put('/:entryID')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changeEntry(
    @Body() body: {
      title: string, description: string,
      customerLink: string
    },
    @Param() params: {entryID: string},
  ) : Promise<Entry> {
    let entry: Entry;
    try {
      entry = await this.entryService.change(
        params.entryID,
        body.title,
        body.description,
        body.customerLink,
      );
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      )
    }

    return entry;
  }

  @Post('/:entryID/image')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination(req, file, callback) {
  //       callback(null, './files/entry');
  //     },
  //   }),
  // }))
  async addEntryImage(
    // @UploadedFile() file: Express.Multer.File,
    @Param() params: {entryID: string},
  ) : Promise<Entry> {
    let entry: Entry;
    try {
      entry = await this.entryService.getOne(
        params.entryID,
      )
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      );
    }

    let filename = 'testing';

    // if images is empty
    let newImages = entry.images;
    if (entry.images.length == 0) {
      filename += 1;
      newImages.push(
        {name: filename, order: 1},
      )
    } else {
      let max = 0;
      for (let i = 0; i < newImages.length; i++) {
        if (newImages[i].order > max) {
          max = newImages[i].order;
        }
      }
      filename += max + 1;
      newImages.push(
        {name: filename, order: max + 1},
      )
    }

    try {
      entry = await this.entryService.changeField(
        params.entryID,
        'images',
        newImages,
      )
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      );
    }

    entry.images = newImages;

    return entry;
  }

  @Put('/:entryID/image/:name')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async changeEntryImage(
    @Param() params: { entryID: string, name: string },
    @Body() body: {order: number},
  ) : Promise<Entry> {
    let entry: Entry;
    try {
      entry = await this.entryService.getOne(
        params.entryID,
      )
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      );
    }

    let newImages = entry.images;
    for (let i = 0; i < newImages.length; i++) {
      if (newImages[i].name == params.name) {
        newImages[i].order = body.order;
      }
    }

    try {
      entry = await this.entryService.changeField(
        params.entryID,
        'images',
        newImages,
      )
    } catch(err) {
      throw new HttpException(
        {message: 'Server error'},
        500
      );
    }

    entry.images = newImages;

    return entry;
  }
}

