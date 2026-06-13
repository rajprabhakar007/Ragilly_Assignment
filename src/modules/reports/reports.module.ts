import { Module } from '@nestjs/common';

import { CacheModule }
from '@nestjs/cache-manager';

import { ReportsController }
from './reports.controller';

import { ReportsService }
from './reports.service';

@Module({
  imports: [
    CacheModule.register(),
  ],

  controllers: [
    ReportsController,
  ],

  providers: [
    ReportsService,
  ],
})
export class ReportsModule {}

