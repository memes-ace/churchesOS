import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/events')
export class EventsController {
  constructor(private service: EventsService) {}
  @Get() findAll(@Param('churchId') churchId: string) { return this.service.findAll(churchId); }
  @Post() create(@Param('churchId') churchId: string, @Body() body: any) { return this.service.create(churchId, body); }
  @Put(':id') update(@Param('churchId') churchId: string, @Param('id') id: string, @Body() body: any) { return this.service.update(churchId, id, body); }
}
