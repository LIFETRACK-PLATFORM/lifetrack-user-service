import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserProfileModel,
  UserProfileSchema,
} from './infrastructure/mongoose/schemas/user-profile.schema';
import { UsersController } from './presentation/controller/user.controller';
import { CreateUserProfileUseCase } from './application/use-cases/create-user-profile.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';
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
  controllers: [UsersController],
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
    {
      provide: GetUserProfileUseCase,
      useFactory: (repo: UserProfileRepositoryPort) =>
        new GetUserProfileUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY],
    },
    {
      provide: UpdateUserProfileUseCase,
      useFactory: (repo: UserProfileRepositoryPort) =>
        new UpdateUserProfileUseCase(repo),
      inject: [USER_PROFILE_REPOSITORY],
    },
  ],
})
export class UserModule {}
