import { UserProfile, UserProfileStatus } from './user-profile.entity';

const baseProps = {
  authUserId: 'user-1',
  email: 'alice@lifetrack.dev',
  displayName: 'Alice',
  timezone: 'America/Lima',
  language: 'es',
  status: UserProfileStatus.ACTIVE,
};

describe('UserProfile', () => {
  it('crea un perfil valido con sus props', () => {
    const profile = new UserProfile(baseProps);

    expect(profile.authUserId).toBe(baseProps.authUserId);
    expect(profile.email).toBe(baseProps.email);
    expect(profile.displayName).toBe(baseProps.displayName);
  });

  it('lanza error si falta el authUserId', () => {
    expect(
      () => new UserProfile({ ...baseProps, authUserId: '' }),
    ).toThrow('El ID de usuario es obligatorio');
  });

  it('lanza error si falta el email', () => {
    expect(
      () => new UserProfile({ ...baseProps, email: '' }),
    ).toThrow('El email es obligatorio');
  });

  it('lanza error si falta el displayName', () => {
    expect(
      () => new UserProfile({ ...baseProps, displayName: '' }),
    ).toThrow('El nombre para mostrar es obligatorio');
  });

  it('isActive() retorna true cuando el status es ACTIVE', () => {
    const profile = new UserProfile(baseProps);
    expect(profile.isActive()).toBe(true);
  });

  it('isActive() retorna false cuando el status es DISABLED', () => {
    const profile = new UserProfile({
      ...baseProps,
      status: UserProfileStatus.DISABLED,
    });
    expect(profile.isActive()).toBe(false);
  });
});
