import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterFbDto {
  @ApiProperty({
    required: false,
    example: 'abc@xyz.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: false,
    example: 'john',
  })
  @IsString()
  @IsOptional()
  firstName?: string = '';

  @ApiProperty({
    required: false,
    example: 'doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string = '';

  @ApiProperty({
    required: true,
    example: 'jfskfhka8348kshfksdkf',
    description: 'Provider id from FB user',
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({
    required: true,
    example: 'device123',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
