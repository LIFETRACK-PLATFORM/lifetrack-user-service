import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from '../../../domain/entities/user-profile.entity';
import {
  EmailAlreadyExistsError,
  UserProfileNotFoundError,
} from '../../../domain/exceptions/user-profile.errors';
import type { UserProfileRepositoryPort } from '../../../domain/ports/user-profile.repository.port';
import {
  UserProfileModel,
  UserProfileDocument,
} from '../../mongoose/schemas/user-profile.schema';
import { UserProfileMapper } from '../mappers/user-profile.mapper';

const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;

@Injectable()
export class MongooseUserProfileRepository implements UserProfileRepositoryPort {
  constructor(
    @InjectModel(UserProfileModel.name)
    private readonly userProfileModel: Model<UserProfileDocument>,
  ) {}

  async findByAuthUserId(authUserId: string): Promise<UserProfile | null> {
    const doc = await this.userProfileModel.findOne({ authUserId }).exec();
    return doc ? UserProfileMapper.toDomain(doc) : null;
  }

  async save(profile: UserProfile): Promise<void> {
    try {
      await this.userProfileModel.create(
        UserProfileMapper.toPersistence(profile),
      );
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: unknown }).code === MONGO_DUPLICATE_KEY_ERROR_CODE
      ) {
        throw new EmailAlreadyExistsError(profile.email);
      }
      throw error;
    }
  }

  async update(profile: UserProfile): Promise<void> {
    const result = await this.userProfileModel
      .updateOne(
        { authUserId: profile.authUserId },
        { $set: UserProfileMapper.toPersistence(profile) },
      )
      .exec();

    if (result.matchedCount === 0) {
      throw new UserProfileNotFoundError(profile.authUserId);
    }
  }
}
