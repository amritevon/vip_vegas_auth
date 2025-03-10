import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterGuestDto {
  @IsString()
  @IsOptional()
  firstName?: string = '';

  @IsString()
  @IsOptional()
  lastName?: string = '';

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
