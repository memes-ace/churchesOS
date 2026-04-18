import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MinistriesService } from './ministries.service';

@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/ministries')
export class MinistriesController {
  constructor(private svc: MinistriesService) {}
  @Get() getAll(@Param('churchId') c: string) { return this.svc.findAll(c); }
  @Post() create(@Param('churchId') c: string, @Body() b: any) { return this.svc.create(c, b); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
  @Get(':ministryId/members') getMembers(@Param('ministryId') mid: string) { return this.svc.getMembers(mid); }
  @Post(':ministryId/members') addMember(@Param('ministryId') mid: string, @Param('churchId') c: string, @Body() b: any) { return this.svc.addMember(mid, c, b); }
  @Put(':ministryId/members/:memberId') updateMember(@Param('memberId') mid: string, @Body() b: any) { return this.svc.updateMember(mid, b); }
  @Delete(':ministryId/members/:memberId') removeMember(@Param('memberId') mid: string) { return this.svc.removeMember(mid); }
}