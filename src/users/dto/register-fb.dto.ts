import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LoginTypeEnum } from 'src/common/enum/role.enum';

export class RegisterFbDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string = '';

  @IsString()
  @IsOptional()
  lastName?: string = '';

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
