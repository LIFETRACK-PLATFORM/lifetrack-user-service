export abstract class DomainError extends Error {}

export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`El email ${email} ya está registrado`);
  }
}

export class UserProfileNotFoundError extends DomainError {
  constructor(authUserId: string) {
    super(`No se encontró el perfil para el usuario ${authUserId}`);
  }
}
