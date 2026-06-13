import {
  Controller,
  Get,
  Headers,
  Param,
} from '@nestjs/common';

import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
  ) {}

  @Get('profit-loss')
  async getProfitLossReport(
    @Headers('tenant-id')
    tenantId: string,
  ) {
    return await this.reportsService.getProfitLossReport(
      tenantId,
    );
  }

  @Get('running-balance/:accountId')
  async getRunningBalance(
    @Param('accountId')
    accountId: string,

    @Headers('tenant-id')
    tenantId: string,
  ) {
    return await this.reportsService.getRunningBalance(
      accountId,
      tenantId,
    );
  }
}