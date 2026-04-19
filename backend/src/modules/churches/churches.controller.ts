import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChurchesService } from './churches.service';

@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class ChurchesController {
  constructor(private svc: ChurchesService) {}

  @Get('churches')
  getAllChurches() { return this.svc.findAll(); }

  @Get('churches/:id')
  getChurch(@Param('id') id: string) { return this.svc.findOne(id); }

  @Put('churches/:id')
  updateChurch(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Get('stats')
  getStats() { return this.svc.getPlatformStats(); }

  @Get('settings')
  getSettings() { return this.svc.getSettings(); }

  @Put('settings')
  updateSettings(@Body() body: any) { return this.svc.updateSettings(body); }

  @Post('sms/send')
  sendSMS(@Body() body: any) { return this.svc.sendSMS(body); }

  @Get('payments')
  getPayments() { return this.svc.getPayments(); }

  @Post('payments')
  submitPayment(@Body() body: any) { return this.svc.submitPayment(body); }

  @Put('payments/:id/approve')
  approvePayment(@Param('id') id: string) { return this.svc.approvePayment(id); }

  @Put('payments/:id/reject')
  rejectPayment(@Param('id') id: string) { return this.svc.rejectPayment(id); }
}
