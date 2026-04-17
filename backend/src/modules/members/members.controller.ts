import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MembersService } from './members.service';
@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/members')
export class MembersController {
  constructor(private service: MembersService) {}
  @Get() findAll(@Param('churchId') churchId: string) { return this.service.findAll(churchId); }
  @Get(':id') findOne(@Param('churchId') churchId: string, @Param('id') id: string) { return this.service.findOne(churchId, id); }
  @Post() create(@Param('churchId') churchId: string, @Body() body: any) { return this.service.create(churchId, body); }
  @Put(':id') update(@Param('churchId') churchId: string, @Param('id') id: string, @Body() body: any) { return this.service.update(churchId, id, body); }
  @Delete(':id') remove(@Param('churchId') churchId: string, @Param('id') id: string) { return this.service.remove(churchId, id); }
}
