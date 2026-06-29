import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateUserProfileUseCase } from '../../application/use-cases/create-user-profile.use-case';
import { AuthUserRegisteredEventDto } from '../dtos/auth-user-registered.dto';

@Controller()
export class UsersEventsController {
  private readonly logger = new Logger(UsersEventsController.name);

  constructor(
    private readonly createUserProfileUseCase: CreateUserProfileUseCase,
  ) {}

  @EventPattern('auth.user_registered')
  async handleAuthUserRegistered(
    @Payload() event: AuthUserRegisteredEventDto,
  ): Promise<void> {
    this.logger.log(
      `Event received: ${event.eventType} (${event.payload.userId})`,
    );
    await this.createUserProfileUseCase.execute(event.payload);
  }
}
