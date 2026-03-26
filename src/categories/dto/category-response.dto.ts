import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';

export class CategoryResponseDto implements Category {
  @ApiProperty({ type: Number, example: 1, description: 'Category id' })
  id: number;

  @ApiProperty({ type: String, example: 'smartphones', description: 'Unique slug' })
  slug: string;

  @ApiProperty({ type: String, example: 'Smartphones', description: 'Display name' })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Mobile phones',
    description: 'Longer description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2025-01-01T00:00:00.000Z',
    description: 'Last update',
  })
  updatedAt: Date;
}
