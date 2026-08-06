import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { envs } from './config/envs';
import { UserModule } from './user/user.module';
import { HealthController } from './app.controller';

@Module({
  imports: [MongooseModule.forRoot(envs.mongoUrl), UserModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
