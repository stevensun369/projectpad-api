import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {MongoURI} from './env';
import { AccountModule } from './account/account.module';


@Module({
  imports: [MongooseModule.forRoot(MongoURI), AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
