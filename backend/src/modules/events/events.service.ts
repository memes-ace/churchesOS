import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChurchEvent } from '../../entities';
@Injectable()
export class EventsService {
  constructor(@InjectRepository(ChurchEvent) private repo: Repository<ChurchEvent>) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { date: 'ASC' } }); }
  create(churchId: string, data: any) { return this.repo.save(this.repo.create({ ...data, church_id: churchId })); }
  async update(churchId: string, id: string, data: any) { await this.repo.update({ id, church_id: churchId }, data); return this.repo.findOne({ where: { id } }); }
}
