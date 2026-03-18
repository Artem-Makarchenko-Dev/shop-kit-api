import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getExistingCategory(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: number) {
    return this.getExistingCategory(id);
  }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.getExistingCategory(id);
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    await this.getExistingCategory(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
