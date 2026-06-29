import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserProfileStatus } from '../../../domain/entities/user-profile.entity';

export type UserProfileDocument = HydratedDocument<UserProfileModel>;

@Schema({
  collection: 'user_profiles',
  timestamps: true,
})
export class UserProfileModel {
  @Prop({ required: true, unique: true, index: true })
  authUserId: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ type: String, default: null })
  firstName?: string | null;

  @Prop({ type: String, default: null })
  lastName?: string | null;

  @Prop({ type: String, default: null })
  avatarUrl?: string | null;

  @Prop({ type: String, default: null })
  phone?: string | null;

  @Prop({ default: 'America/Lima' })
  timezone: string;

  @Prop({ default: 'es' })
  language: string;

  @Prop({ enum: UserProfileStatus, default: UserProfileStatus.ACTIVE })
  status: UserProfileStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfileModel);
