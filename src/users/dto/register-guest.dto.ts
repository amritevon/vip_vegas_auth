import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterGuestDto {
  @ApiProperty({
    required: true,
    example: 'john',
  })
  @IsString()
  @IsOptional()
  firstName?: string = '';

  @ApiProperty({
    required: true,
    example: 'doe',
  })
  @IsString()
  @IsOptional()
  lastName?: string = '';

  @ApiProperty({
    required: true,
    example: 'device123',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
