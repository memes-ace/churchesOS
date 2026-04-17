import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';
@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/attendance')
export class AttendanceController {
  constructor(private service: AttendanceService) {}
  @Get() findAll(@Param('churchId') churchId: string) { return this.service.findAll(churchId); }
  @Post() create(@Param('churchId') churchId: string, @Body() body: any) { return this.service.create(churchId, body); }
  @Get('stats') getStats(@Param('churchId') churchId: string) { return this.service.getStats(churchId); }
}
