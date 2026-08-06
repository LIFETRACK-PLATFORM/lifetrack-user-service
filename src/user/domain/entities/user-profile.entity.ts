import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';
import { InvalidUserProfileDataError } from '../exceptions/user-profile.errors';

export enum UserProfileStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export type UserProfileProps = {
  authUserId: string;
  email: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  timezone: string;
  language: string;
  status: UserProfileStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserProfile extends AggregateRoot<UserProfileProps> {
  constructor(props: UserProfileProps, id?: string) {
    if (!props.authUserId)
      throw new InvalidUserProfileDataError('El ID de usuario es obligatorio');
    if (!props.email)
      throw new InvalidUserProfileDataError('El email es obligatorio');
    if (!props.displayName)
      throw new InvalidUserProfileDataError(
        'El nombre para mostrar es obligatorio',
      );
    super(props, id);
  }

  get authUserId(): string {
    return this.props.authUserId;
  }
  get email(): string {
    return this.props.email;
  }
  get displayName(): string {
    return this.props.displayName;
  }
  get firstName(): string | null | undefined {
    return this.props.firstName;
  }
  get lastName(): string | null | undefined {
    return this.props.lastName;
  }
  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }
  get phone(): string | null | undefined {
    return this.props.phone;
  }
  get timezone(): string {
    return this.props.timezone;
  }
  get language(): string {
    return this.props.language;
  }
  get status(): UserProfileStatus {
    return this.props.status;
  }
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return this.props.status === UserProfileStatus.ACTIVE;
  }

  update(data: {
    displayName: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    timezone: string;
    language: string;
  }): void {
    if (!data.displayName?.trim()) {
      throw new InvalidUserProfileDataError(
        'El nombre para mostrar es obligatorio',
      );
    }
    if (!data.timezone?.trim()) {
      throw new InvalidUserProfileDataError('La zona horaria es obligatoria');
    }
    if (!data.language?.trim()) {
      throw new InvalidUserProfileDataError('El idioma es obligatorio');
    }

    this.props.displayName = data.displayName.trim();
    this.props.firstName = data.firstName ?? null;
    this.props.lastName = data.lastName ?? null;
    this.props.avatarUrl = data.avatarUrl ?? null;
    this.props.phone = data.phone ?? null;
    this.props.timezone = data.timezone.trim();
    this.props.language = data.language.trim();
    this.props.updatedAt = new Date();
  }
}
