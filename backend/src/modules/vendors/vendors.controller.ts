import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private svc: VendorsService) {}
  @Get() getAll() { return this.svc.findAll(); }
  @Get('approved') getApproved() { return this.svc.findApproved(); }
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}