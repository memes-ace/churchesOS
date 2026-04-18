import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CellGroupsService } from './cellgroups.service';

@UseGuards(AuthGuard('jwt'))
@Controller('churches/:churchId/cell-groups')
export class CellGroupsController {
  constructor(private svc: CellGroupsService) {}
  @Get() getAll(@Param('churchId') c: string) { return this.svc.findAll(c); }
  @Post() create(@Param('churchId') c: string, @Body() b: any) { return this.svc.create(c, b); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(id, b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
  @Get(':cellId/members') getMembers(@Param('cellId') cid: string) { return this.svc.getMembers(cid); }
  @Post(':cellId/members') addMember(@Param('cellId') cid: string, @Param('churchId') c: string, @Body() b: any) { return this.svc.addMember(cid, c, b); }
  @Put(':cellId/members/:memberId') updateMember(@Param('memberId') mid: string, @Body() b: any) { return this.svc.updateMember(mid, b); }
  @Delete(':cellId/members/:memberId') removeMember(@Param('memberId') mid: string) { return this.svc.removeMember(mid); }
  @Get(':cellId/attendance') getAttendance(@Param('cellId') cid: string) { return this.svc.getAttendance(cid); }
  @Post(':cellId/attendance') addAttendance(@Param('cellId') cid: string, @Param('churchId') c: string, @Body() b: any) { return this.svc.addAttendance(cid, c, b); }
}