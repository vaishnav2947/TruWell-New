import { Controller, Get, HttpService } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    const status = await this.healthService.checkAll();
    const isHealthy = Object.values(status).every((s) => s === true);

    return {
      status: isHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks: state,
    };
  }
}