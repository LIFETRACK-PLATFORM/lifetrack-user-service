import {
  UserProfile,
  UserProfileStatus,
} from '../../domain/entities/user-profile.entity';
import { UserProfileNotFoundError } from '../../domain/exceptions/user-profile.errors';
import type { UserProfileRepositoryPort } from '../../domain/ports/user-profile.repository.port';
import { GetUserProfileUseCase } from './get-user-profile.use-case';

describe('GetUserProfileUseCase', () => {
  const profile = new UserProfile({
    authUserId: 'user-1',
    email: 'alice@lifetrack.dev',
    displayName: 'Alice',
    timezone: 'America/Lima',
    language: 'es',
    status: UserProfileStatus.ACTIVE,
  });

  let repository: jest.Mocked<UserProfileRepositoryPort>;
  let useCase: GetUserProfileUseCase;

  beforeEach(() => {
    repository = {
      findByAuthUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };
    useCase = new GetUserProfileUseCase(repository);
  });

  it('retorna el perfil cuando existe', async () => {
    repository.findByAuthUserId.mockResolvedValue(profile);

    const result = await useCase.execute('user-1');

    expect(result).toBe(profile);
    expect(repository.findByAuthUserId.mock.calls).toEqual([['user-1']]);
  });

  it('lanza UserProfileNotFoundError cuando no existe', async () => {
    repository.findByAuthUserId.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      UserProfileNotFoundError,
    );
  });
});
