import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'Jane Doe',
    description: 'Display name of the user',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'jane@example.com',
    description: 'Unique email used for login',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'password123',
    minLength: 6,
    description: 'Plain password (min. 6 characters); stored hashed',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: [String],
    example: ['USER'],
    description: 'Role names to assign (e.g. USER, MANAGER, ADMIN)',
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  refreshToken?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: 'Whether the account can authenticate',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: String,
    example: '1990-01-15',
    description: 'Date of birth (ISO 8601 date string)',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirthday?: string;
}
