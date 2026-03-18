import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ResponseRoleDto } from '../roles/dto/response-role.dto';
import { UserWithRolesDto } from './dto/user-with-roles.dto';
import { UserRolesService } from './user-roles.service';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post(':userId/:roleId')
  assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<ResponseRoleDto[]> {
    return this.userRolesService.assignRoleToUser(userId, roleId);
  }

  @Delete(':userId/:roleId')
  @HttpCode(200)
  removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<ResponseRoleDto[]> {
    return this.userRolesService.removeRoleFromUser(userId, roleId);
  }

  @Get('user/:userId')
  getRoles(@Param('userId', ParseIntPipe) userId: number): Promise<ResponseRoleDto[]> {
    return this.userRolesService.getRolesForUser(userId);
  }

  @Get('role/:roleId')
  getUsers(@Param('roleId', ParseIntPipe) roleId: number): Promise<UserWithRolesDto[]> {
    return this.userRolesService.getUsersWithRole(roleId);
  }
}
