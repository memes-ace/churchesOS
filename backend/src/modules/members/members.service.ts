import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../entities';
@Injectable()
export class MembersService {
  constructor(@InjectRepository(Member) private repo: Repository<Member>) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId, is_active: true }, order: { created_at: 'DESC' } }); }
  findOne(churchId: string, id: string) { return this.repo.findOne({ where: { id, church_id: churchId } }); }
  create(churchId: string, data: any) { return this.repo.save(this.repo.create({ ...data, church_id: churchId })); }
  async update(churchId: string, id: string, data: any) { await this.repo.update({ id, church_id: churchId }, data); return this.findOne(churchId, id); }
  async remove(churchId: string, id: string) { await this.repo.update({ id, church_id: churchId }, { is_active: false }); return { success: true }; }
}
