import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CounsellingService } from './counselling.service';

@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/counselling')
export class CounsellingController {
  constructor(private svc: CounsellingService) {}
  @Get() getAll(@Param('churchId') c: string) { return this.svc.findAll(c); }
  @Post() create(@Param('churchId') c: string, @Body() b: any) { return this.svc.create(c, b); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}