import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/schemas/account.schema';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtSecret } from 'src/env';

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
    JwtModule.register({
      global: true,
      secret: JwtSecret,
    })
  ],
  controllers: [AccountController],
  providers: [AccountService, JwtService],
})
export class AccountModule {}
