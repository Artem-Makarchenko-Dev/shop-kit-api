import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getExistingRole(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: number) {
    return this.getExistingRole(id);
  }

  async create(dto: CreateRoleDto) {
    try {
      return await this.prisma.role.create({ data: dto });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException(`Role with name "${dto.name}" already exists`);
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    await this.getExistingRole(id);
    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    await this.getExistingRole(id);
    return this.prisma.role.delete({ where: { id } });
  }
}
