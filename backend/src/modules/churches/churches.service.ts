import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church, Member, Transaction, AttendanceRecord, PaymentRequest, PlatformSettings, SmsTopup, MarketplaceSubscription } from '../../entities';

@Injectable()
export class ChurchesService {
  constructor(
    @InjectRepository(Church) private churchRepo: Repository<Church>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(Transaction) private transRepo: Repository<Transaction>,
    @InjectRepository(AttendanceRecord) private attendRepo: Repository<AttendanceRecord>,
    @InjectRepository(PaymentRequest) private paymentRepo: Repository<PaymentRequest>,
    @InjectRepository(PlatformSettings) private settingsRepo: Repository<PlatformSettings>,
    @InjectRepository(SmsTopup) private smsTopupRepo: Repository<SmsTopup>,
    @InjectRepository(MarketplaceSubscription) private mktRepo: Repository<MarketplaceSubscription>,
    private emailService: EmailService,
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
    if (data.sender_id !== undefined) updateData.sender_id = data.sender_id
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.website !== undefined) updateData.website = data.website
    if (data.description !== undefined) updateData.description = data.description
    if (data.logo_url !== undefined) updateData.logo_url = data.logo_url
    if (data.primary_color !== undefined) updateData.primary_color = data.primary_color
    if (data.tagline !== undefined) updateData.tagline = data.tagline
    if (data.denomination !== undefined) updateData.denomination = data.denomination
    if (data.service_time !== undefined) updateData.service_time = data.service_time
    if (data.email !== undefined) updateData.email = data.email
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

  async sendSMS(data: any) {
    const { recipients, message, senderId } = data
    const username = process.env.NALO_USERNAME || ''
    const password = process.env.NALO_PASSWORD || ''
    const sender = senderId || process.env.NALO_SENDER_ID || 'Tabscrow'

    const results = []
    const errors = []

    for (const phone of recipients) {
      try {
        const response = await fetch('https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            msisdn: phone,
            message,
            sender_id: sender,
          })
        })
        const text = await response.text()
        results.push({ phone, status: 'sent', response: text })
      } catch(e) {
        errors.push({ phone, status: 'failed', error: (e as any).message })
      }
    }

    // Increment SMS count for this church
    const { churchId } = data
    if (churchId && results.length > 0) {
      try {
        await this.churchRepo.increment({ id: churchId }, 'sms_sent_count', results.length)
      } catch(e) { console.warn('SMS count update failed:', e) }
    }

    return {
      success: true,
      sent: results.length,
      failed: errors.length,
      results,
      errors,
    }
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
    // Find church admin email and notify
    try {
      const { InjectRepository } = require('@nestjs/typeorm')
      const User = require('../../entities').User
      // Get church to find admin user
      const church = await this.churchRepo.findOne({ where: { id: payment.church_id } })
      if (church) {
        await this.emailService.sendPaymentApprovedEmail(payment.church_name, payment.plan_requested, church.email || '')
      }
    } catch(e) { console.warn('Email error:', e) }
    return { success: true }
  }

  async rejectPayment(id: string) {
    const payment = await this.paymentRepo.findOne({ where: { id } })
    await this.paymentRepo.update(id, { status: 'rejected' })
    try {
      if (payment) {
        const church = await this.churchRepo.findOne({ where: { id: payment.church_id } })
        if (church) {
          await this.emailService.sendPaymentRejectedEmail(payment.church_name, payment.plan_requested, church.email || '')
        }
      }
    } catch(e) { console.warn('Email error:', e) }
    return { success: true }
  }

  private defaultSettings: any = {
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
    freePlan: { price: 0, memberLimit: 100, features: ['Members', 'Attendance', 'Prayer Requests', 'Announcements', 'Church Settings'] },
  };

  async submitSmsTopup(data: any) {
    return this.smsTopupRepo.save(this.smsTopupRepo.create({
      church_id: data.church_id,
      church_name: data.church_name,
      amount: data.amount,
      transaction_id: data.transaction_id,
      notes: data.notes || '',
      status: 'pending',
    }))
  }

  async getSmsTopups() {
    return this.smsTopupRepo.find({ order: { created_at: 'DESC' } })
  }

  async approveSmsTopup(id: string) {
    const topup = await this.smsTopupRepo.findOne({ where: { id } })
    if (!topup) return { error: 'Not found' }
    await this.smsTopupRepo.update(id, { status: 'approved' })
    // Enable SMS for this church
    await this.churchRepo.update(topup.church_id, { sms_enabled: true })
    return { success: true }
  }

  async rejectSmsTopup(id: string) {
    const topup = await this.smsTopupRepo.findOne({ where: { id } })
    if (!topup) return { error: 'Not found' }
    await this.smsTopupRepo.update(id, { status: 'rejected' })
    return { success: true }
  }

  async resetSmsCount(churchId: string) {
    await this.churchRepo.update(churchId, { sms_sent_count: 0 })
    return { success: true }
  }

  async toggleSmsEnabled(churchId: string, enabled: boolean) {
    await this.churchRepo.update(churchId, { sms_enabled: enabled })
    return { success: true, sms_enabled: enabled }
  }

  async getSmsStatus(churchId: string) {
    const church = await this.churchRepo.findOne({ where: { id: churchId } })
    return { sms_enabled: church?.sms_enabled || false }
  }

  async getChurchBranding(churchId: string) {
    const church = await this.churchRepo.findOne({ where: { id: churchId } })
    if (!church) return { error: 'Church not found' }
    return {
      id: church.id,
      name: church.name,
      logo_url: church.logo_url || '',
      primary_color: church.primary_color || '#1B4FD8',
      tagline: church.tagline || '',
      location: church.location || '',
      phone: church.phone || '',
    }
  }

  async submitMarketplaceSubscription(data: any) {
    return this.mktRepo.save(this.mktRepo.create({
      church_id: data.church_id,
      church_name: data.church_name,
      amount: data.amount || '50',
      transaction_id: data.transaction_id,
      notes: data.notes || '',
      status: 'pending',
    }))
  }

  async getMarketplaceSubscriptions() {
    return this.mktRepo.find({ order: { created_at: 'DESC' } })
  }

  async approveMarketplaceSubscription(id: string) {
    const sub = await this.mktRepo.findOne({ where: { id } })
    if (!sub) return { error: 'Not found' }
    await this.mktRepo.update(id, { status: 'approved' })
    await this.churchRepo.update(sub.church_id, { marketplace_enabled: true })
    return { success: true }
  }

  async rejectMarketplaceSubscription(id: string) {
    await this.mktRepo.update(id, { status: 'rejected' })
    return { success: true }
  }

  async toggleMarketplace(churchId: string, enabled: boolean) {
    await this.churchRepo.update(churchId, { marketplace_enabled: enabled })
    return { success: true, marketplace_enabled: enabled }
  }

  async getSettings() {
    try {
      const row = await this.settingsRepo.findOne({ where: { key: 'platform_settings' } })
      if (row) return { ...this.defaultSettings, ...JSON.parse(row.value) }
      return this.defaultSettings
    } catch(e) {
      return this.defaultSettings
    }
  }

  async updateSettings(data: any) {
    try {
      const current = await this.getSettings()
      const merged = { ...current, ...data }
      const existing = await this.settingsRepo.findOne({ where: { key: 'platform_settings' } })
      if (existing) {
        await this.settingsRepo.update(existing.id, { value: JSON.stringify(merged) })
      } else {
        await this.settingsRepo.save(this.settingsRepo.create({ key: 'platform_settings', value: JSON.stringify(merged) }))
      }
      return { success: true, settings: merged }
    } catch(e) {
      return { success: false, error: (e as any).message }
    }
  }
}
