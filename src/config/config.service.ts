import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  get jwtSecret(): string {
    return this.nestConfigService.get<string>('JWT_SECRET', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDMxYzQ2OC0wMzhkLTQ3MTEtOTA0OC00NzY4YTA2YTk0NzUiLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY3ODgzMzQzLCJleHAiOjE3Njc5Njk3NDN9.nWJlviwODDT6ocwbVYrJNyVqPlDNothtM4gQG7ZVPd8');
  }

  get jwtExpiresIn(): string {
    return this.nestConfigService.get<string>('JWT_EXPIRES_IN', '24h');
  }
}
