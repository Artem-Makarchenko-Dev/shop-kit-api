import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateFinalPrice(price: number, discount?: number) {
    return price - price * ((discount ?? 0) / 100);
  }

  async getExistingProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.getExistingProduct(id);
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description ?? '',
        price: dto.price,
        discount: dto.discount ?? 0,
        finalPrice: this.calculateFinalPrice(dto.price, dto.discount),
      },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.getExistingProduct(id);
    const price = dto.price ?? existing.price;
    const discount = dto.discount ?? existing.discount;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        finalPrice: this.calculateFinalPrice(price, discount),
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: number) {
    await this.getExistingProduct(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
