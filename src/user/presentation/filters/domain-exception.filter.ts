import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import {
  DomainError,
  EmailAlreadyExistsError,
  InvalidUserProfileDataError,
  UserProfileNotFoundError,
} from '../../domain/exceptions/user-profile.errors';

type DomainErrorConstructor = new (...args: unknown[]) => DomainError;

const ERROR_CODE_MAP = new Map<DomainErrorConstructor, GrpcStatus>([
  [UserProfileNotFoundError, GrpcStatus.NOT_FOUND],
  [EmailAlreadyExistsError, GrpcStatus.ALREADY_EXISTS],
  [InvalidUserProfileDataError, GrpcStatus.INVALID_ARGUMENT],
]);

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, _: ArgumentsHost): Observable<never> {
    const code =
      ERROR_CODE_MAP.get(exception.constructor as DomainErrorConstructor) ??
      GrpcStatus.INVALID_ARGUMENT;

    return throwError(() => ({ code, message: exception.message }));
  }
}
