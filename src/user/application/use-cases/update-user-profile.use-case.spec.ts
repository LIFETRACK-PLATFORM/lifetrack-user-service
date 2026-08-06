import {
  UserProfile,
  UserProfileStatus,
} from '../../domain/entities/user-profile.entity';
import { UserProfileNotFoundError } from '../../domain/exceptions/user-profile.errors';
import type { UserProfileRepositoryPort } from '../../domain/ports/user-profile.repository.port';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';

describe('UpdateUserProfileUseCase', () => {
  let repository: jest.Mocked<UserProfileRepositoryPort>;
  let useCase: UpdateUserProfileUseCase;

  beforeEach(() => {
    repository = {
      findByAuthUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    useCase = new UpdateUserProfileUseCase(repository);
  });

  it('actualiza y persiste el perfil', async () => {
    const profile = new UserProfile({
      authUserId: 'user-1',
      email: 'alice@lifetrack.dev',
      displayName: 'Alice',
      timezone: 'America/Lima',
      language: 'es',
      status: UserProfileStatus.ACTIVE,
    });
    repository.findByAuthUserId.mockResolvedValue(profile);
    repository.update.mockResolvedValue(undefined);

    const result = await useCase.execute({
      authUserId: 'user-1',
      displayName: 'Alice Updated',
      firstName: 'Alice',
      lastName: 'Smith',
      phone: '+51999',
      timezone: 'America/Bogota',
      language: 'en',
    });

    expect(result.displayName).toBe('Alice Updated');
    expect(result.firstName).toBe('Alice');
    expect(repository.update).toHaveBeenCalledWith(profile);
  });

  it('lanza UserProfileNotFoundError cuando no existe', async () => {
    repository.findByAuthUserId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        authUserId: 'missing',
        displayName: 'X',
        timezone: 'America/Lima',
        language: 'es',
      }),
    ).rejects.toBeInstanceOf(UserProfileNotFoundError);
  });
});
