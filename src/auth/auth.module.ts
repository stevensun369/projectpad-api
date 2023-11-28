import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/schemas/account.schema';
import {  AuthController } from './auth.controller';

import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AuthService } from './auth.service';
import { AccountService } from 'src/account/account.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }), 
    MongooseModule.forFeature(
      [{name: Account.name, schema: AccountSchema}]
    ),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountService],
})
export class AuthModule {}
