import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtSecret, MongoURI } from './env';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from './account/account.module';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(MongoURI), AuthModule, 
    JwtModule.register({
      global: true,
      secret: JwtSecret,
      signOptions: {expiresIn: 60 * 60 * 24 * 365}
    }), AccountModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
      serveRoot: '/files/',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
