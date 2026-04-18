import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
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
}
