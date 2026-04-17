import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../../entities';
@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(AttendanceRecord) private repo: Repository<AttendanceRecord>) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { created_at: 'DESC' } }); }
  create(churchId: string, data: any) { return this.repo.save(this.repo.create({ ...data, church_id: churchId })); }
  async getStats(churchId: string) {
    const records = await this.repo.find({ where: { church_id: churchId }, order: { created_at: 'DESC' }, take: 12 });
    const avg = records.length ? Math.round(records.reduce((s, r) => s + r.count, 0) / records.length) : 0;
    return { records, average: avg, latest: records[0]?.count || 0 };
  }
}
