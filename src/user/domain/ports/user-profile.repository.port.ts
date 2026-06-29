import { UserProfile } from '../entities/user-profile.entity';

export interface UserProfileRepositoryPort {
  findByAuthUserId(authUserId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<void>;
}
