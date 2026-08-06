import { Controller, Logger, UseFilters } from '@nestjs/common';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import type { Metadata } from '@grpc/grpc-js';
import { CreateUserProfileUseCase } from '../../application/use-cases/create-user-profile.use-case';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { AuthUserRegisteredEventDto } from '../dtos/auth-user-registered.dto';
import { UpdateMyProfileDto } from '../dtos/update-my-profile.dto';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { getAuthenticatedUserId } from '../auth/grpc-auth.context';
import { toUserProfileResponse } from '../mappers/user-profile-response.mapper';

@Controller()
@UseFilters(DomainExceptionFilter)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
  ) {}

  @EventPattern('auth.user_registered')
  async handleAuthUserRegistered(
    @Payload() event: AuthUserRegisteredEventDto,
  ): Promise<void> {
    this.logger.log(
      `Event received: ${event.eventType} (${event.payload.userId})`,
    );
    await this.createUserProfileUseCase.execute(event.payload);
  }

  @GrpcMethod('UserService', 'GetMyProfile')
  async getMyProfile(_data: Record<string, never>, metadata: Metadata) {
    const authUserId = getAuthenticatedUserId(metadata);
    const profile = await this.getUserProfileUseCase.execute(authUserId);
    return toUserProfileResponse(profile);
  }

  @GrpcMethod('UserService', 'UpdateMyProfile')
  async updateMyProfile(data: UpdateMyProfileDto, metadata: Metadata) {
    const authUserId = getAuthenticatedUserId(metadata);
    const profile = await this.updateUserProfileUseCase.execute({
      authUserId,
      displayName: data.displayName,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      avatarUrl: data.avatarUrl || null,
      phone: data.phone || null,
      timezone: data.timezone,
      language: data.language,
    });
    return toUserProfileResponse(profile);
  }
}
