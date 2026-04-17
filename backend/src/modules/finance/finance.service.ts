import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../entities';
@Injectable()
export class FinanceService {
  constructor(@InjectRepository(Transaction) private repo: Repository<Transaction>) {}
  findAll(churchId: string) { return this.repo.find({ where: { church_id: churchId }, order: { created_at: 'DESC' } }); }
  create(churchId: string, data: any) { return this.repo.save(this.repo.create({ ...data, church_id: churchId })); }
  async getSummary(churchId: string) {
    const txs = await this.repo.find({ where: { church_id: churchId } });
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }
}
