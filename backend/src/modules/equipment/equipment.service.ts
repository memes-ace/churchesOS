import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentReport } from '../../entities';

@Injectable()
export class EquipmentService {
  constructor(@InjectRepository(EquipmentReport) private repo: Repository<EquipmentReport>) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { created_at: 'DESC' } }); }
  create(churchId: string, data: any) { return this.repo.save({ ...data, church_id: churchId }); }
  update(id: string, data: any) { return this.repo.update(id, data); }
  remove(id: string) { return this.repo.delete(id); }
}