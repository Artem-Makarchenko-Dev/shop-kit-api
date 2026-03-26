import { ApiProperty } from '@nestjs/swagger';

class ProductRatingDto {
  @ApiProperty({ type: Number, example: 4.5, description: 'Average rating' })
  rate: number;

  @ApiProperty({ type: Number, example: 120, description: 'Number of ratings' })
  count: number;
}

export class ProductResponseDto {
  @ApiProperty({ type: Number, example: 1, description: 'Product id' })
  id: number;

  @ApiProperty({
    type: String,
    example: 'iPhone 15',
    description: 'Product title or name',
  })
  title: string;

  @ApiProperty({ type: Number, example: 999.99, description: 'Current price' })
  price: number;

  @ApiProperty({
    type: String,
    example: 'Description text',
    description: 'Product description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: String,
    example: 'https://cdn.example.com/img.jpg',
    description: 'Primary image URL',
    nullable: true,
  })
  image: string | null;

  @ApiProperty({ type: Number, example: 10, description: 'Discount percentage' })
  discount: number;

  @ApiProperty({ type: Number, example: 899.99, description: 'Price after discount' })
  finalPrice: number;

  @ApiProperty({
    type: String,
    isArray: true,
    example: ['smartphone'],
    description: 'Category labels',
  })
  categories: string[];

  @ApiProperty({
    type: ProductRatingDto,
    description: 'Aggregated rating',
    example: { rate: 4.5, count: 120 },
  })
  rating: {
    rate: number;
    count: number;
  };
}
