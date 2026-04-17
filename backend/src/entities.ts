import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('churches')
export class Church {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) pastor_name: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) logo_url: string;
  @Column({ nullable: true }) tagline: string;
  @Column({ nullable: true }) denomination: string;
  @Column({ nullable: true }) service_time: string;
  @Column({ nullable: true }) primary_color: string;
  @Column({ default: 'starter' }) plan: string;
  @Column({ default: 'trial' }) status: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column({ default: 'church_admin' }) role: string;
  @Column({ nullable: true }) church_id: string;
  @Column({ nullable: true }) title: string;
  @ManyToOne(() => Church, { nullable: true })
  @JoinColumn({ name: 'church_id' })
  church: Church;
  @CreateDateColumn() created_at: Date;
}

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) gender: string;
  @Column({ nullable: true }) date_of_birth: string;
  @Column({ nullable: true }) address: string;
  @Column({ default: 'Member' }) status: string;
  @Column({ default: 'Active' }) membership: string;
  @Column({ nullable: true }) ministry: string;
  @Column({ nullable: true }) occupation: string;
  @Column({ nullable: true }) marital_status: string;
  @Column({ nullable: true }) baptism_date: string;
  @Column({ nullable: true }) notes: string;
  @Column({ default: true }) is_active: boolean;
  @CreateDateColumn() created_at: Date;
}

@Entity('attendance_records')
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() service_name: string;
  @Column() service_type: string;
  @Column() date: string;
  @Column() count: number;
  @CreateDateColumn() created_at: Date;
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() type: string;
  @Column() category: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
  @Column({ nullable: true }) member_name: string;
  @Column({ nullable: true }) payment_method: string;
  @Column({ nullable: true }) notes: string;
  @Column() date: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('events')
export class ChurchEvent {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column() type: string;
  @Column() date: string;
  @Column({ nullable: true }) time: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) capacity: number;
  @Column({ default: 0 }) registered: number;
  @Column({ default: 'upcoming' }) status: string;
  @CreateDateColumn() created_at: Date;
}
