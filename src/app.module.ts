import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {JwtSecret, MongoURI} from './env';
import {  AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Account, AccountSchema } from './schemas/account.schema';
import { AccountModule } from './account/account.module';


@Module({
  imports: [MongooseModule.forRoot(MongoURI), AuthModule, 
    JwtModule.register({
      global: true,
      secret: JwtSecret,
      signOptions: {expiresIn: 60 * 60 * 24 * 365}
    }), AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
