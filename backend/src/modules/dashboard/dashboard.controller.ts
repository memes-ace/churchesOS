import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
@UseGuards(AuthGuard('jwt'))
@Controller()
export class DashboardController {
  constructor(private service: DashboardService) {}
  @Get('churches/:churchId/dashboard') getChurchStats(@Param('churchId') churchId: string) { return this.service.getChurchStats(churchId); }
  @Get('admin/dashboard') getPlatformStats() { return this.service.getPlatformStats(); }
}
