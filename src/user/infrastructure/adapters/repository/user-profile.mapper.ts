import { UserProfile } from '../../../domain/entities/user-profile.entity';
import { UserProfileDocument } from '../../mongoose/schemas/user-profile.schema';

export class UserProfileMapper {
  static toDomain(doc: UserProfileDocument): UserProfile {
    return new UserProfile(
      {
        authUserId: doc.authUserId,
        email: doc.email,
        displayName: doc.displayName,
        firstName: doc.firstName,
        lastName: doc.lastName,
        avatarUrl: doc.avatarUrl,
        phone: doc.phone,
        timezone: doc.timezone,
        language: doc.language,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toString(),
    );
  }

  static toPersistence(domain: UserProfile) {
    return {
      authUserId: domain.authUserId,
      email: domain.email,
      displayName: domain.displayName,
      firstName: domain.firstName,
      lastName: domain.lastName,
      avatarUrl: domain.avatarUrl,
      phone: domain.phone,
      timezone: domain.timezone,
      language: domain.language,
      status: domain.status,
    };
  }
}
