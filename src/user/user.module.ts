import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserProfileModel,
  UserProfileSchema,
} from './infrastructure/mongoose/schemas/user-profile.schema';
import { UsersEventsController } from './presentation/controller/user.controller';
import { CreateUserProfileUseCase } from './application/use-cases/create-user-profile.use-case';
import { USER_PROFILE_REPOSITORY } from './domain/ports/tokens';
import { MongooseUserProfileRepository } from './infrastructure/adapters/repository/user-profile.repository';
import type { UserProfileRepositoryPort } from './domain/ports/user-profile.repository.port';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserProfileModel.name,
        schema: UserProfileSchema,
      },
    ]),
  ],
  controllers: [UsersEventsController],
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: MongooseUserProfileRepository,
    },
    {
      provide: CreateUserProfileUseCase,
      useFactory: (repo: UserProfileRepositoryPort) =>
        new CreateUserProfileUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY],
    },
  ],
})
export class UserModule {}
