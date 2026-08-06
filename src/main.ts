import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { envs } from './config/envs';
import { spanishValidationExceptionFactory } from './shared/utils/spanish-validation-exception-factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'lifetrack.user',
      protoPath: join(process.cwd(), 'src/proto/user.proto'),
      url: `0.0.0.0:${envs.port}`,
      loader: { arrays: true, defaults: true },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: spanishValidationExceptionFactory,
    }),
  );

  await app.startAllMicroservices();
  await app.init();
}
void bootstrap();
