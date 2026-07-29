import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async checkDatabase(): Promise<boolean> {
    try {
      // Execute a simple query to check the database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  // Add more checks for Redis, etc. if needed

  async checkAll(): Promise<{ [key: string]: boolean }> {
    const dbStatus = await this.checkDatabase();
    // Add other checks here
    return {
      database: dbStatus,
      // redis: await this.checkRedis(),
    };
  }
}