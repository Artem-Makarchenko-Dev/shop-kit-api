import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'smartphones',
    description: 'URL-safe unique slug',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    type: String,
    example: 'Smartphones',
    description: 'Human-readable category name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Mobile phones and accessories',
    description: 'Optional long description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
