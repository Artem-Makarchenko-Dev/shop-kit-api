import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class ProductWithCategoriesDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discount: number;
  finalPrice: number;
  image: string | null;
  ratingRate: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  categories: CategoryResponseDto[];
}
