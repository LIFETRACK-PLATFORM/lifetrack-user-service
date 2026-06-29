import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AuthUserRegisteredPayloadDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

export class AuthUserRegisteredEventDto {
  @IsString()
  eventId: string;

  @IsString()
  eventType: string;

  @IsNumber()
  version: number;

  @IsString()
  occurredAt: string;

  @IsString()
  producer: string;

  @IsString()
  correlationId: string;

  @IsString()
  actorId: string;

  @ValidateNested()
  @Type(() => AuthUserRegisteredPayloadDto)
  payload: AuthUserRegisteredPayloadDto;
}
