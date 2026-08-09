import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { envs } from './config/envs';
import { spanishValidationExceptionFactory } from './shared/utils/spanish-validation-exception-factory';

const contractsProtoPath = (file: string) =>
  join(dirname(require.resolve('@lifetrack/contracts/package.json')), 'proto', file);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'lifetrack.user',
      protoPath: contractsProtoPath('user.proto'),
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
  await app.listen(3000);
}
void bootstrap();
