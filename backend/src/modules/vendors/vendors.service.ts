import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities';

@Injectable()
export class VendorsService {
  constructor(@InjectRepository(Vendor) private repo: Repository<Vendor>) {}
  findAll() { return this.repo.find({ order: { created_at: 'DESC' } }); }
  findApproved() { return this.repo.find({ where: { status: 'Approved' }, order: { created_at: 'DESC' } }); }
  create(data: any) { return this.repo.save(data); }
  update(id: string, data: any) { return this.repo.update(id, data); }
  remove(id: string) { return this.repo.delete(id); }
}