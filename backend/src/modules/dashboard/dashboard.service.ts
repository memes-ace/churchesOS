import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member, AttendanceRecord, Transaction, ChurchEvent, Church } from '../../entities';
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(AttendanceRecord) private attendanceRepo: Repository<AttendanceRecord>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(ChurchEvent) private eventRepo: Repository<ChurchEvent>,
    @InjectRepository(Church) private churchRepo: Repository<Church>,
  ) {}
  async getChurchStats(churchId: string) {
    const [totalMembers, recentAttendance, transactions, upcomingEvents] = await Promise.all([
      this.memberRepo.count({ where: { church_id: churchId, is_active: true } }),
      this.attendanceRepo.find({ where: { church_id: churchId }, order: { created_at: 'DESC' }, take: 1 }),
      this.txRepo.find({ where: { church_id: churchId } }),
      this.eventRepo.find({ where: { church_id: churchId, status: 'upcoming' } }),
    ]);
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const church = await this.churchRepo.findOne({ where: { id: churchId } });
    return { 
      totalMembers, 
      lastAttendance: recentAttendance[0]?.count || 0, 
      monthlyGiving: income, 
      upcomingEvents: upcomingEvents.length,
      plan: church?.plan || 'trial',
      status: church?.status || 'trial',
      church_name: church?.name || '',
      sender_id: church?.sender_id || 'Tabscrow',
      sms_enabled: church?.sms_enabled || false,
      marketplace_enabled: church?.marketplace_enabled || false,
    };
  }
  async getPlatformStats() {
    const churches = await this.churchRepo.find();
    const totalMembers = await this.memberRepo.count();
    return { totalChurches: churches.length, activeChurches: churches.filter(c => c.status === 'active').length, totalMembers };
  }
}
