import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ministry, MinistryMember } from '../../entities';

@Injectable()
export class MinistriesService {
  constructor(
    @InjectRepository(Ministry) private repo: Repository<Ministry>,
    @InjectRepository(MinistryMember) private memberRepo: Repository<MinistryMember>,
  ) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { created_at: 'ASC' } }); }
  create(churchId: string, data: any) { return this.repo.save({ ...data, church_id: churchId }); }
  update(id: string, data: any) { return this.repo.update(id, data); }
  remove(id: string) { return this.repo.delete(id); }
  getMembers(ministryId: string) { return this.memberRepo.find({ where: { ministry_id: ministryId } }); }
  addMember(ministryId: string, churchId: string, data: any) { return this.memberRepo.save({ ...data, ministry_id: ministryId, church_id: churchId }); }
  updateMember(id: string, data: any) { return this.memberRepo.update(id, data); }
  removeMember(id: string) { return this.memberRepo.delete(id); }
}