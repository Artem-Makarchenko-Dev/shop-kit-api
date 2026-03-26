import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BEARER_JWT, OpenApi } from '../common/swagger/openapi.constants';
import { USER_ROLES } from '../common/types/roles.types';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@ApiBearerAuth(BEARER_JWT)
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List categories',
    description: 'Public.',
    security: [],
  })
  @ApiOkResponse({ description: 'Array of categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get category by id',
    description: 'Public.',
    security: [],
  })
  @ApiParam({ name: 'id', description: 'Category id', example: 1 })
  @ApiOkResponse({ description: 'Category' })
  @ApiNotFoundResponse({ description: 'Category not found (404).' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @Roles(USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'Create category',
    description: 'MANAGER only (slug and name must be unique).',
  })
  @ApiCreatedResponse({ description: 'Created category', type: CategoryResponseDto })
  @ApiBadRequestResponse({ description: OpenApi.Err400 })
  @ApiForbiddenResponse({ description: OpenApi.Err403.managerOnly })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @Roles(USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'Update category',
    description: 'Partial update. MANAGER only.',
  })
  @ApiParam({ name: 'id', description: 'Category id', example: 1 })
  @ApiOkResponse({ description: 'Updated category' })
  @ApiBadRequestResponse({ description: OpenApi.Err400 })
  @ApiForbiddenResponse({ description: OpenApi.Err403.manager })
  @ApiNotFoundResponse({ description: 'Category not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'Delete category',
    description: 'MANAGER only.',
  })
  @ApiParam({ name: 'id', description: 'Category id', example: 1 })
  @ApiOkResponse({ description: 'Deleted category' })
  @ApiForbiddenResponse({ description: OpenApi.Err403.manager })
  @ApiNotFoundResponse({ description: 'Category not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}
