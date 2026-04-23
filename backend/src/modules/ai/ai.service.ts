import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Church, Member, Transaction, AttendanceRecord } from '../../entities';

@Injectable()
export class AiService {
  private geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private apiKey = process.env.GEMINI_API_KEY;

  constructor(
    @InjectRepository(Church) private churchRepo: Repository<Church>,
    @InjectRepository(Member) private memberRepo: Repository<Member>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    @InjectRepository(AttendanceRecord) private attRepo: Repository<AttendanceRecord>,
  ) {}

  private async callGemini(prompt: string): Promise<string> {
    const res = await fetch(`${this.geminiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
  }

  private async getContext(churchId: string) {
    const church = await this.churchRepo.findOne({ where: { id: churchId } });
    const members = await this.memberRepo.find({ where: { church_id: churchId } });
    const transactions = await this.txRepo.find({ where: { church_id: churchId } });
    const attendance = await this.attRepo.find({ where: { church_id: churchId } });
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
    const activeMembers = members.filter(m => m.status === 'Active').length;
    const inactiveMembers = members.filter(m => m.status === 'Inactive').length;
    return { church, members, transactions, attendance, totalIncome, totalExpense, activeMembers, inactiveMembers };
  }

  async chat(churchId: string, message: string): Promise<string> {
    const ctx = await this.getContext(churchId);
    const prompt = `You are an intelligent AI assistant for ${ctx.church?.name}, a church management system.
Be helpful, concise and pastoral in tone. You have access to real church data.

CHURCH DATA:
- Church: ${ctx.church?.name} (${ctx.church?.plan} plan)
- Total Members: ${ctx.members.length} (${ctx.activeMembers} active, ${ctx.inactiveMembers} inactive)
- Total Income: GHC ${ctx.totalIncome.toLocaleString()}
- Total Expenses: GHC ${ctx.totalExpense.toLocaleString()}
- Balance: GHC ${(ctx.totalIncome - ctx.totalExpense).toLocaleString()}
- Attendance Records: ${ctx.attendance.length}

MEMBERS (first 20):
${ctx.members.slice(0, 20).map(m => `- ${m.name} | ${m.status} | Phone: ${m.phone || 'N/A'} | Ministry: ${m.ministry || 'None'}`).join('\n')}

RECENT TRANSACTIONS (last 10):
${ctx.transactions.slice(0, 10).map(t => `- ${t.type}: GHC ${t.amount} | ${t.category || t.notes || 'N/A'} | ${t.date}`).join('\n')}

PASTOR'S QUESTION: ${message}

Answer helpfully and accurately. If asked to draft messages or letters, write them professionally. If asked about specific members, reference the data above.`;
    return this.callGemini(prompt);
  }

  async getAnalytics(churchId: string): Promise<any> {
    const ctx = await this.getContext(churchId);
    const prompt = `Analyze this church data and return ONLY a JSON object, no markdown, no explanation:

Church: ${ctx.church?.name}
Members: ${ctx.members.length} total, ${ctx.activeMembers} active, ${ctx.inactiveMembers} inactive
Income: GHC ${ctx.totalIncome}, Expenses: GHC ${ctx.totalExpense}, Balance: GHC ${ctx.totalIncome - ctx.totalExpense}
Attendance records: ${ctx.attendance.length}

Return this exact JSON:
{"health_score":0,"health_label":"","key_insights":[],"predictions":[],"recommendations":[],"financial_trend":"","membership_trend":"","risk_alerts":[]}`;
    const response = await this.callGemini(prompt);
    try { return JSON.parse(response.replace(/```json|```/g, '').trim()); }
    catch { return { health_score: 75, health_label: 'Good', key_insights: [response], predictions: [], recommendations: [], financial_trend: 'Stable', membership_trend: 'Stable', risk_alerts: [] }; }
  }

  async getEngagement(churchId: string): Promise<any[]> {
    const ctx = await this.getContext(churchId);
    const prompt = `Score church member engagement. Return ONLY a JSON array, no markdown:

Members: ${ctx.members.slice(0, 20).map(m => `${m.id}|${m.name}|${m.status}|${m.ministry || 'none'}`).join(', ')}
Attendance records: ${ctx.attendance.length}

Return this exact JSON array format:
[{"member_id":"","name":"","engagement_score":0,"engagement_label":"","recommended_action":""}]`;
    const response = await this.callGemini(prompt);
    try { return JSON.parse(response.replace(/```json|```/g, '').trim()); }
    catch { return ctx.members.slice(0, 20).map(m => ({ member_id: m.id, name: m.name, engagement_score: m.status === 'Active' ? 70 : 30, engagement_label: m.status === 'Active' ? 'Engaged' : 'At Risk', recommended_action: 'Follow up with member' })); }
  }

  async getGrowth(churchId: string): Promise<any> {
    const ctx = await this.getContext(churchId);
    const prompt = `You are a church growth expert. Analyze and return ONLY a JSON object, no markdown:

Church: ${ctx.church?.name}, Plan: ${ctx.church?.plan}
Members: ${ctx.members.length} (${ctx.activeMembers} active, ${ctx.inactiveMembers} inactive)
Finance: GHC ${ctx.totalIncome} income, GHC ${ctx.totalExpense} expenses

Return this exact JSON:
{"growth_score":0,"summary":"","wins":[],"challenges":[],"this_week_actions":[],"this_month_goals":[],"member_retention_tips":[],"giving_growth_tips":[],"outreach_ideas":[]}`;
    const response = await this.callGemini(prompt);
    try { return JSON.parse(response.replace(/```json|```/g, '').trim()); }
    catch { return { growth_score: 70, summary: response, wins: [], challenges: [], this_week_actions: [], this_month_goals: [], member_retention_tips: [], giving_growth_tips: [], outreach_ideas: [] }; }
  }
}
