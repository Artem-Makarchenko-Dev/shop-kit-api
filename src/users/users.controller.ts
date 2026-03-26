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
import type { JwtUser } from '../auth/types/jwt.type';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BEARER_JWT, OpenApi } from '../common/swagger/openapi.constants';
import { USER_ROLES } from '../common/types/roles.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth(BEARER_JWT)
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Profile from JWT payload (any authenticated role).',
  })
  @ApiOkResponse({ description: 'Current user' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  getMe(@CurrentUser() user: JwtUser) {
    return user;
  }

  @Get()
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'List users',
    description: 'ADMIN or MANAGER only.',
  })
  @ApiOkResponse({ description: 'List of users (may include password hash field)' })
  @ApiForbiddenResponse({ description: OpenApi.Err403.adminOrManager })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Any authenticated user.',
  })
  @ApiParam({ name: 'id', description: 'User id', example: 1 })
  @ApiOkResponse({ description: 'User record' })
  @ApiNotFoundResponse({ description: 'User not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(USER_ROLES.ADMIN, USER_ROLES.MANAGER)
  @ApiOperation({
    summary: 'Update user',
    description: 'Partial update. ADMIN or MANAGER only.',
  })
  @ApiParam({ name: 'id', description: 'User id', example: 1 })
  @ApiOkResponse({ description: 'Updated user' })
  @ApiBadRequestResponse({ description: OpenApi.Err400 })
  @ApiForbiddenResponse({ description: OpenApi.Err403.adminOrManager })
  @ApiNotFoundResponse({ description: 'User not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Register user',
    description: 'Create account; password stored hashed. Public.',
    security: [],
  })
  @ApiCreatedResponse({
    description: 'Created (201). Body matches persisted user; password is stored as hash.',
  })
  @ApiBadRequestResponse({ description: OpenApi.Err400 })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  @Roles(USER_ROLES.ADMIN)
  @ApiOperation({
    summary: 'Delete user',
    description: 'ADMIN only.',
  })
  @ApiParam({ name: 'id', description: 'User id', example: 1 })
  @ApiOkResponse({ description: 'Deleted user' })
  @ApiForbiddenResponse({ description: OpenApi.Err403.admin })
  @ApiNotFoundResponse({ description: 'User not found (404).' })
  @ApiUnauthorizedResponse({ description: OpenApi.Err401 })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
