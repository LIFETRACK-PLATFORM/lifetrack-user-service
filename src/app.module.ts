import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(envs.mongoUrl), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
