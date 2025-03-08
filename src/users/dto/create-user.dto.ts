import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(4, { message: 'Password must be at least 4 characters' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  // @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
  //   message: 'Password must contain at least one letter and one number',
  // })
  password: string;

  @IsString()
  username: string;
}
