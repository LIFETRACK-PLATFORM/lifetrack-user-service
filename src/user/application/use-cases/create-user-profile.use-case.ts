import {
  UserProfile,
  UserProfileStatus,
} from '../../domain/entities/user-profile.entity';
import type { UserProfileRepositoryPort } from '../../domain/ports/user-profile.repository.port';
import type { CreateUserProfileInput } from '../dtos/create-user-profile.input';

export class CreateUserProfileUseCase {
  constructor(
    private readonly userProfileRepository: UserProfileRepositoryPort,
  ) {}

  async execute(input: CreateUserProfileInput): Promise<void> {
    const existing = await this.userProfileRepository.findByAuthUserId(
      input.userId,
    );
    if (existing) return;

    const profile = new UserProfile({
      authUserId: input.userId,
      email: input.email,
      displayName: input.displayName,
      timezone: 'America/Lima',
      language: 'es',
      status: UserProfileStatus.ACTIVE,
    });

    await this.userProfileRepository.save(profile);
  }
}
