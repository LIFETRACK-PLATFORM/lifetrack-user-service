import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';

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
    if (!props.authUserId) throw new Error('Auth user ID is required');
    if (!props.email) throw new Error('Email is required');
    if (!props.displayName) throw new Error('Display name is required');
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
}
