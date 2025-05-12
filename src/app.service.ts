import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): object {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date(),
    };
  }
}
