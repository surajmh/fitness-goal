import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService, SyncChanges } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getStatus() {
    return this.appService.getStatus();
  }

  @Get('sync/pull')
  pull(@Query('lastPulledAt') lastPulledAt?: string) {
    return this.appService.pullChanges(
      lastPulledAt ? Number(lastPulledAt) : undefined,
    );
  }

  @Post('sync/push')
  push(
    @Body()
    payload: {
      changes?: Partial<SyncChanges>;
      lastPulledAt?: number;
    },
  ) {
    return this.appService.acceptPush(
      payload.changes ?? {},
      payload.lastPulledAt,
    );
  }
}
