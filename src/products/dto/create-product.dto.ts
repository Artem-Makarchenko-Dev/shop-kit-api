import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from '../types/product.type';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    example: 'iPhone 15',
    description: 'Product display name',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Latest generation smartphone',
    description: 'Longer product description',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    type: Number,
    example: 999.99,
    description: 'Base price before discount',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description: 'Discount percentage (0–100)',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  discount?: number;

  @ApiProperty({
    enum: PRODUCT_CATEGORIES,
    example: PRODUCT_CATEGORIES.SMARTPHONE,
    description: 'Primary product category label',
  })
  @IsNotEmpty()
  category: ProductCategory;

  @ApiProperty({
    type: [String],
    example: ['5G', 'OLED'],
    description: 'Feature bullet strings',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://cdn.example.com/p1.jpg'],
    description: 'Image URLs',
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({
    type: Number,
    example: 42,
    description: 'Units in stock',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'Acme',
    description: 'Brand or manufacturer',
  })
  @IsOptional()
  @IsString()
  brand?: string;
}
