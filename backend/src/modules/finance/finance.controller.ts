import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FinanceService } from './finance.service';
@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/finance')
export class FinanceController {
  constructor(private service: FinanceService) {}
  @Get('transactions') findAll(@Param('churchId') churchId: string) { return this.service.findAll(churchId); }
  @Post('transactions') create(@Param('churchId') churchId: string, @Body() body: any) { return this.service.create(churchId, body); }
  @Get('summary') getSummary(@Param('churchId') churchId: string) { return this.service.getSummary(churchId); }
}
