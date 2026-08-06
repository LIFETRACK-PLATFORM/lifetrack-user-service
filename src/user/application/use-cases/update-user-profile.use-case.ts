import { UserProfile } from '../../domain/entities/user-profile.entity';
import { UserProfileNotFoundError } from '../../domain/exceptions/user-profile.errors';
import type { UserProfileRepositoryPort } from '../../domain/ports/user-profile.repository.port';
import type { UpdateUserProfileInput } from '../dtos/update-user-profile.input';

export class UpdateUserProfileUseCase {
  constructor(
    private readonly userProfileRepository: UserProfileRepositoryPort,
  ) {}

  async execute(input: UpdateUserProfileInput): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findByAuthUserId(
      input.authUserId,
    );

    if (!profile) {
      throw new UserProfileNotFoundError(input.authUserId);
    }

    profile.update({
      displayName: input.displayName,
      firstName: input.firstName,
      lastName: input.lastName,
      avatarUrl: input.avatarUrl,
      phone: input.phone,
      timezone: input.timezone,
      language: input.language,
    });

    await this.userProfileRepository.update(profile);
    return profile;
  }
}
