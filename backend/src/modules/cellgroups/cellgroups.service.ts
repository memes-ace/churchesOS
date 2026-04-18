import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CellGroup, CellGroupMember, CellAttendance } from '../../entities';

@Injectable()
export class CellGroupsService {
  constructor(
    @InjectRepository(CellGroup) private repo: Repository<CellGroup>,
    @InjectRepository(CellGroupMember) private memberRepo: Repository<CellGroupMember>,
    @InjectRepository(CellAttendance) private attendRepo: Repository<CellAttendance>,
  ) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { created_at: 'ASC' } }); }
  create(churchId: string, data: any) { return this.repo.save({ ...data, church_id: churchId }); }
  update(id: string, data: any) { return this.repo.update(id, data); }
  remove(id: string) { return this.repo.delete(id); }
  getMembers(cellId: string) { return this.memberRepo.find({ where: { cell_group_id: cellId } }); }
  addMember(cellId: string, churchId: string, data: any) { return this.memberRepo.save({ ...data, cell_group_id: cellId, church_id: churchId }); }
  updateMember(id: string, data: any) { return this.memberRepo.update(id, data); }
  removeMember(id: string) { return this.memberRepo.delete(id); }
  getAttendance(cellId: string) { return this.attendRepo.find({ where: { cell_group_id: cellId }, order: { created_at: 'DESC' } }); }
  addAttendance(cellId: string, churchId: string, data: any) { return this.attendRepo.save({ ...data, cell_group_id: cellId, church_id: churchId }); }
}