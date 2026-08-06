import { UserProfile } from '../../domain/entities/user-profile.entity';
import { UserProfileNotFoundError } from '../../domain/exceptions/user-profile.errors';
import type { UserProfileRepositoryPort } from '../../domain/ports/user-profile.repository.port';

export class GetUserProfileUseCase {
  constructor(
    private readonly userProfileRepository: UserProfileRepositoryPort,
  ) {}

  async execute(authUserId: string): Promise<UserProfile> {
    const profile =
      await this.userProfileRepository.findByAuthUserId(authUserId);

    if (!profile) {
      throw new UserProfileNotFoundError(authUserId);
    }

    return profile;
  }
}
