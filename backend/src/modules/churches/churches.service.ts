import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church, Member, Transaction, AttendanceRecord, PaymentRequest } from '../../entities';

@Injectable()
export class ChurchesService {
  constructor(
    @InjectRepository(Church) private churchRepo: Repository<Church>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(Transaction) private transRepo: Repository<Transaction>,
    @InjectRepository(AttendanceRecord) private attendRepo: Repository<AttendanceRecord>,
    @InjectRepository(PaymentRequest) private paymentRepo: Repository<PaymentRequest>,
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
    const updateData: any = {}
    if (data.status !== undefined) updateData.status = data.status
    if (data.plan !== undefined) updateData.plan = data.plan
    if (data.features !== undefined) updateData.features = data.features
    if (data.name !== undefined) updateData.name = data.name
    if (data.pastor_name !== undefined) updateData.pastor_name = data.pastor_name
    await this.churchRepo.update(id, updateData)
    return this.findOne(id)
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

  async submitPayment(data: any) {
    return this.paymentRepo.save(this.paymentRepo.create({
      church_id: data.church_id,
      church_name: data.church_name,
      plan_requested: data.plan_requested,
      amount: data.amount,
      payment_method: data.payment_method,
      reference: data.reference,
      proof_description: data.proof_description,
      status: 'pending',
    }))
  }

  async getPayments() {
    return this.paymentRepo.find({ order: { created_at: 'DESC' } })
  }

  async approvePayment(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } })
    if (!payment) return { error: 'Not found' }
    await this.paymentRepo.update(id, { status: 'approved' })
    await this.churchRepo.update(payment.church_id, { plan: payment.plan_requested, status: 'active' })
    return { success: true }
  }

  async rejectPayment(id: string) {
    await this.paymentRepo.update(id, { status: 'rejected' })
    return { success: true }
  }

  private platformSettings: any = {
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
    starterPlan: { price: 1800, memberLimit: 500, features: ['Members', 'Attendance', 'Finance', 'Events', 'Sermons', 'Visitors', 'Prayer Requests', 'Announcements'] },
    growthPlan: { price: 5400, memberLimit: 2000, features: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Song Library', 'Reports'] },
    enterprisePlan: { price: 10200, memberLimit: 999999, features: ['Members', 'Attendance', 'Finance', 'Events', 'Communication', 'Sermons', 'Visitors', 'Prayer Requests', 'Ministries', 'Cell Groups', 'Counselling', 'Announcements', 'Volunteers', 'Marketplace', 'Song Library', 'Equipment', 'Purchases', 'Reports', 'Roles & Access'] },
    freePlan: { price: 0, memberLimit: 100, features: ['Members', 'Attendance', 'Prayer Requests', 'Announcements'] },
  };

  async getSettings() {
    return this.platformSettings;
  }

  async updateSettings(data: any) {
    this.platformSettings = { ...this.platformSettings, ...data };
    return { success: true, settings: this.platformSettings };
  }
}
