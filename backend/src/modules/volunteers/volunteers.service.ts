import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from '../../entities';

@Injectable()
export class VolunteersService {
  constructor(@InjectRepository(Volunteer) private repo: Repository<Volunteer>) {}

  getAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { created_at: 'DESC' } }) }
  create(churchId: string, data: any) { return this.repo.save(this.repo.create({ ...data, church_id: churchId })) }
  update(id: string, data: any) { return this.repo.update(id, data).then(() => this.repo.findOne({ where: { id } })) }
  delete(id: string) { return this.repo.delete(id) }
}
