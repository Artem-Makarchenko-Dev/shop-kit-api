import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole, Role } from '@prisma/client';
import { JwtPayload } from './types/jwt.type';
import { AuthResult, SafeUser, Tokens } from '../users/types/users.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user?.isActive) {
      throw new UnauthorizedException('Invalid email or inactive user');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password: _, ...result } = user;
    return result as SafeUser;
  }

  async login(user: SafeUser): Promise<AuthResult> {
    const userWithRoles = await this.usersService.findOneWithRoles(user.id);
    const roles = userWithRoles.userRoles.map((ur: UserRole & { role: Role }) => ur.role.name);

    const payload: JwtPayload = { sub: user.id, email: user.email, roles };
    const tokens = this.generateTokens(payload);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.update(user.id, { refreshToken: hashedRefreshToken });

    return { ...tokens, user: { ...user, roles } };
  }

  async verifyRefreshToken(token: string): Promise<SafeUser> {
    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.usersService.findOne(payload.sub);
    if (!user?.isActive || !user.refreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid or expired refresh token');

    const { password, ...safeUser } = user;
    return safeUser as SafeUser;
  }

  async logout(userId: number): Promise<{ success: boolean; message: string }> {
    await this.usersService.update(userId, { refreshToken: null });
    return {
      success: true,
      message: 'Successfully logged out',
    };
  }

  private generateTokens(payload: JwtPayload): Tokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
