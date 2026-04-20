import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { User, Church } from '../../entities';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Church) private churchRepo: Repository<Church>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    await this.seedDemoData();
  }

  async seedDemoData() {
    try {
      const adminExists = await this.userRepo.findOne({ where: { email: 'churchesos97@gmail.com' } });
      if (!adminExists) {
        const hashed = await bcrypt.hash('Arielle@2025', 10);
        await this.userRepo.save(this.userRepo.create({
          name: 'Super Admin',
          email: 'churchesos97@gmail.com',
          password: hashed,
          role: 'super_admin',
        }));
        console.log('Super admin seeded');
      }
      const churchAdminExists = await this.userRepo.findOne({ where: { email: 'pastor@gracechapel.com' } });
      if (!churchAdminExists) {
        let church = await this.churchRepo.findOne({ where: { name: 'Grace Chapel International' } });
        if (!church) {
          church = await this.churchRepo.save(this.churchRepo.create({
            name: 'Grace Chapel International',
            pastor_name: 'Rev. Samuel Mensah',
            location: 'Accra, Ghana',
            plan: 'church',
            status: 'active',
            primary_color: '#1B4FD8',
          }));
        }
        const hashed = await bcrypt.hash('pastor123', 10);
        await this.userRepo.save(this.userRepo.create({
          name: 'Rev. Samuel Mensah',
          email: 'pastor@gracechapel.com',
          password: hashed,
          role: 'church_admin',
          church_id: church.id,
        }));
        console.log('Church admin seeded');
      }
    } catch (err) {
      console.log('Seed note:', (err as any).message);
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');
    const payload = { sub: user.id, email: user.email, role: user.role, church_id: user.church_id };
    // Get church details if church admin
    let churchData = null
    if (user.church_id) {
      churchData = await this.churchRepo.findOne({ where: { id: user.church_id } })
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id, name: user.name, email: user.email,
        role: user.role, church_id: user.church_id,
        church_name: churchData?.name || '',
        church_plan: churchData?.plan || 'trial',
        church_status: churchData?.status || 'trial',
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    if (!user) return { message: 'If this email exists, a reset code has been sent' }
    // Generate 6-digit reset code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    await this.userRepo.update(user.id, { 
      reset_code: code, 
      reset_code_expires: expires 
    })
    console.log(`Password reset code for ${email}: ${code}`) // In production send via SMS/email
    return { message: 'Reset code sent', code } // Remove code in production
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { email } })
    if (!user) throw new Error('Invalid request')
    if (user.reset_code !== code) throw new Error('Invalid reset code')
    if (new Date() > new Date(user.reset_code_expires)) throw new Error('Reset code expired')
    const hashed = await bcrypt.hash(newPassword, 10)
    await this.userRepo.update(user.id, { 
      password: hashed, 
      reset_code: null, 
      reset_code_expires: null 
    })
    return { message: 'Password reset successful' }
  }

  async register(data: any) {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already registered');
    const church = await this.churchRepo.save(this.churchRepo.create({
      name: data.churchName,
      location: data.location,
      pastor_name: data.name,
      status: 'trial',
      plan: 'starter',
      primary_color: data.primaryColor || '#1B4FD8',
      tagline: data.tagline || '',
      denomination: data.denomination || '',
      service_time: data.serviceTime || '',
    }));
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.save(this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: 'church_admin',
      church_id: church.id,
      title: data.title || '',
    }));
    const payload = { sub: user.id, email: user.email, role: user.role, church_id: user.church_id };
    // Get church details if church admin
    let churchData = null
    if (user.church_id) {
      churchData = await this.churchRepo.findOne({ where: { id: user.church_id } })
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id, name: user.name, email: user.email,
        role: user.role, church_id: user.church_id,
        church_name: churchData?.name || '',
        church_plan: churchData?.plan || 'trial',
        church_status: churchData?.status || 'trial',
      },
    };
  }
}
