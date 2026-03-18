import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { ProductWithCategoriesDto } from './dto/product-with-categories.dto';
import { ProductCategoriesService } from './product-categories.service';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Post(':productId/:categoryId')
  assignCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.productCategoriesService.assignCategoryToProduct(productId, categoryId);
  }

  @Delete(':productId/:categoryId')
  @HttpCode(200)
  removeCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.productCategoriesService.removeCategoryFromProduct(productId, categoryId);
  }

  @Get('product/:productId')
  getCategoriesForProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.productCategoriesService.getCategoriesForProduct(productId);
  }

  @Get('category/:categoryId')
  getProductsForCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<ProductWithCategoriesDto[]> {
    return this.productCategoriesService.getProductsForCategory(categoryId);
  }
}
