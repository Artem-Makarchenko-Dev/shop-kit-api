import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { ProductWithCategoriesDto } from './dto/product-with-categories.dto';
import { ProductCategoriesService } from './product-categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { USER_ROLES } from '../common/types/roles.types';

@Controller('product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Roles(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
  @Post(':productId/:categoryId')
  assignCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.productCategoriesService.assignCategoryToProduct(productId, categoryId);
  }

  @Roles(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
  @Delete(':productId/:categoryId')
  @HttpCode(200)
  removeCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.productCategoriesService.removeCategoryFromProduct(productId, categoryId);
  }

  @Public()
  @Get('product/:productId')
  getCategoriesForProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<CategoryResponseDto[]> {
    return this.productCategoriesService.getCategoriesForProduct(productId);
  }

  @Public()
  @Get('category/:categoryId')
  getProductsForCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<ProductWithCategoriesDto[]> {
    return this.productCategoriesService.getProductsForCategory(categoryId);
  }
}
