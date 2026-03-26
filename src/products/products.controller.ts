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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth(BEARER_JWT)
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List products',
    description: 'Public.',
    security: [],
  })
  @ApiOkResponse({ description: 'Array of products' })
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get product by id',
    description: 'Public.',
    security: [],
  })
  @ApiParam({ name: 'id', description: 'Product id', example: 1 })
  @ApiOkResponse({ description: 'Product' })
  @ApiNotFoundResponse({ description: 'Product not found (404).' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'Create product',
    description: 'ADMIN or MANAGER only.',
  })
  @ApiCreatedResponse({
    description:
      'Created (201). Persisted fields follow Prisma Product (name, price, discount, finalPrice, etc.).',
  })
  @ApiBadRequestResponse({ description: OpenApi.Err400 })
  @ApiForbiddenResponse({ description: OpenApi.Err403.adminOrManager })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'Update product',
    description: 'Partial update; final price recalculated server-side. ADMIN or MANAGER only.',
  })
  @ApiParam({ name: 'id', description: 'Product id', example: 1 })
  @ApiOkResponse({ description: 'Updated product' })
  @ApiBadRequestResponse({ description: OpenApi.Err400 })
  @ApiForbiddenResponse({ description: OpenApi.Err403.adminOrManager })
  @ApiNotFoundResponse({ description: 'Product not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({
    summary: 'Delete product',
    description: 'ADMIN only.',
  })
  @ApiParam({ name: 'id', description: 'Product id', example: 1 })
  @ApiOkResponse({ description: 'Deleted product' })
  @ApiForbiddenResponse({ description: OpenApi.Err403.admin })
  @ApiNotFoundResponse({ description: 'Product not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
