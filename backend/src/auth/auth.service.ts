import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, pass: string) {
    let admin = await this.prisma.admin.findUnique({ where: { username } });

    if (!admin && username === 'admin' && pass === 'admin123') {
      let tenant = await this.prisma.tenant.findUnique({ where: { slug: 'greatcampus' } });
      if (!tenant) {
        tenant = await this.prisma.tenant.create({
          data: { name: 'GREATCAMPUS', slug: 'greatcampus' },
        });
      }

      admin = await this.prisma.admin.create({
        data: {
          username: 'admin',
          password: 'admin123',
          name: 'HR System Administrator',
          tenantId: tenant.id,
        },
      });
    }

    if (admin && admin.password === pass) {
      const payload = { username: admin.username, sub: admin.id, role: admin.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: admin.id, username: admin.username, name: admin.name, role: admin.role },
      };
    }

    throw new UnauthorizedException('Invalid admin credentials');
  }
}
