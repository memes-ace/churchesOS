import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church, Member, Transaction, AttendanceRecord } from '../../entities';

@Injectable()
export class ChurchesService {
  constructor(
    @InjectRepository(Church) private churchRepo: Repository<Church>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(Transaction) private transRepo: Repository<Transaction>,
    @InjectRepository(AttendanceRecord) private attendRepo: Repository<AttendanceRecord>,
  ) {}

  async findAll() {
    const churches = await this.churchRepo.find({ order: { created_at: 'DESC' } });
    const result = await Promise.all(churches.map(async (church) => {
      const memberCount = await this.memberRepo.count({ where: { church_id: church.id } });
      const transactions = await this.transRepo.find({ where: { church_id: church.id, type: 'income' } });
      const revenue = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
      return { ...church, member_count: memberCount, monthly_revenue: revenue };
    }));
    return result;
  }

  async findOne(id: string) {
    const church = await this.churchRepo.findOne({ where: { id } });
    const memberCount = await this.memberRepo.count({ where: { church_id: id } });
    return { ...church, member_count: memberCount };
  }

  async update(id: string, data: any) {
    await this.churchRepo.update(id, data);
    return this.findOne(id);
  }

  async getPlatformStats() {
    const churches = await this.churchRepo.find();
    const members = await this.memberRepo.count();
    const transactions = await this.transRepo.find({ where: { type: 'income' } });
    const totalRevenue = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
    const activeChurches = churches.filter(c => c.status === 'active' || c.status === 'Active').length;
    const planCounts = churches.reduce((acc, c) => {
      acc[c.plan] = (acc[c.plan] || 0) + 1;
      return acc;
    }, {} as any);

    return {
      totalChurches: churches.length,
      activeChurches,
      totalMembers: members,
      totalRevenue,
      planCounts,
      pendingChurches: churches.filter(c => c.status === 'pending' || c.status === 'Pending').length,
    };
  }

  async getSettings() {
    // Return platform settings - stored as a special church record or env
    return {
      platformName: 'ChurchesOS',
      commissionRate: '3',
      starterPrice: '1800',
      growthPrice: '5400',
      enterprisePrice: '10200',
      freePlanLimit: '100',
      supportEmail: 'support@churchesos.com',
      supportPhone: '+233 24 000 0000',
      maintenanceMode: false,
      newRegistrations: true,
    };
  }

  async updateSettings(data: any) {
    // In production this would be stored in a settings table
    return { success: true, settings: data };
  }
}
