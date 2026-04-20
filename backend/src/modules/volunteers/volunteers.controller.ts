import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VolunteersService } from './volunteers.service';

@Controller('churches/:churchId/volunteers')
@UseGuards(AuthGuard('jwt'))
export class VolunteersController {
  constructor(private svc: VolunteersService) {}
  @Get() getAll(@Param('churchId') id: string) { return this.svc.getAll(id) }
  @Post() create(@Param('churchId') id: string, @Body() body: any) { return this.svc.create(id, body) }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body) }
  @Delete(':id') delete(@Param('id') id: string) { return this.svc.delete(id) }
}
