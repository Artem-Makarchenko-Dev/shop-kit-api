import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryResponseDto } from '../categories/dto/category-response.dto';
import { CategoriesService } from '../categories/categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { ProductWithCategoriesDto } from './dto/product-with-categories.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private async ensureProductAndCategoryExist(productId: number, categoryId: number) {
    const product = await this.productsService.getExistingProduct(productId);
    const category = await this.categoriesService.getExistingCategory(categoryId);
    return { product, category };
  }

  private async findProductCategory(productId: number, categoryId: number) {
    await this.ensureProductAndCategoryExist(productId, categoryId);
    return this.prisma.productCategory.findUnique({
      where: {
        productId_categoryId: { productId, categoryId },
      },
    });
  }

  private async getCategoriesForProductRelation(productId: number): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      where: { products: { some: { productId } } },
    });

    return categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  async assignCategoryToProduct(productId: number, categoryId: number) {
    const existingRelation = await this.findProductCategory(productId, categoryId);
    if (existingRelation) {
      throw new ConflictException(
        `Product with id ${productId} already has category ${categoryId}`,
      );
    }

    await this.prisma.productCategory.create({
      data: { productId, categoryId },
    });

    return this.getCategoriesForProductRelation(productId);
  }

  async removeCategoryFromProduct(productId: number, categoryId: number) {
    const existingRelation = await this.findProductCategory(productId, categoryId);
    if (!existingRelation) {
      throw new NotFoundException(
        `Product with id ${productId} does not have category with id ${categoryId}`,
      );
    }

    await this.prisma.productCategory.delete({
      where: {
        productId_categoryId: { productId, categoryId },
      },
    });

    return this.getCategoriesForProductRelation(productId);
  }

  async getCategoriesForProduct(productId: number): Promise<CategoryResponseDto[]> {
    await this.productsService.getExistingProduct(productId);
    return this.getCategoriesForProductRelation(productId);
  }

  async getProductsForCategory(categoryId: number): Promise<ProductWithCategoriesDto[]> {
    await this.categoriesService.getExistingCategory(categoryId);

    const products = await this.prisma.product.findMany({
      where: {
        categories: {
          some: { categoryId },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return products.map(({ categories, ...product }) => ({
      ...product,
      categories: categories.map(({ category }) => ({
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })),
    }));
  }
}
