import { UserProfile } from '../../domain/entities/user-profile.entity';

export type UserProfileResponseDto = {
  id: string;
  authUserId: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  phone: string;
  timezone: string;
  language: string;
  status: string;
};

export function toUserProfileResponse(
  profile: UserProfile,
): UserProfileResponseDto {
  return {
    id: profile.id,
    authUserId: profile.authUserId,
    email: profile.email,
    displayName: profile.displayName,
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    phone: profile.phone ?? '',
    timezone: profile.timezone,
    language: profile.language,
    status: profile.status,
  };
}
