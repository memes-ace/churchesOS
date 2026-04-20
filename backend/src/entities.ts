import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('churches')
export class Church {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ nullable: true }) pastor_name: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) phone2: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) logo_url: string;
  @Column({ nullable: true }) tagline: string;
  @Column({ nullable: true }) denomination: string;
  @Column({ nullable: true }) service_time: string;
  @Column({ nullable: true }) primary_color: string;
  @Column({ default: 'starter' }) plan: string;
  @Column({ nullable: true }) sender_id: string;
  @Column({ nullable: true }) address: string;
  @Column({ nullable: true }) website: string;
  @Column({ nullable: true }) description: string;
  @Column({ default: 'trial' }) status: string;
  @Column({ nullable: true, type: 'text' }) features: string;
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
  @Column({ nullable: true }) reset_code: string;
  @Column({ nullable: true, type: 'timestamp' }) reset_code_expires: Date;
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
  @Column({ nullable: true }) phone2: string;
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

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() full_name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) phone2: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) gender: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) date_of_first_visit: string;
  @Column({ nullable: true }) service_attended: string;
  @Column({ nullable: true }) invited_by: string;
  @Column({ nullable: true }) invited_by_name: string;
  @Column({ nullable: true }) wants_to_be_member: string;
  @Column({ nullable: true }) interested_in_baptism: string;
  @Column({ nullable: true }) follow_up_status: string;
  @Column({ nullable: true }) follow_up_assigned_to: string;
  @Column({ nullable: true }) visitor_status: string;
  @Column({ nullable: true }) notes: string;
  @Column({ nullable: true }) prayer_request: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('prayer_requests')
export class PrayerRequest {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) phone2: string;
  @Column() request: string;
  @Column({ default: false }) anonymous: boolean;
  @Column({ default: 'Pending' }) status: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('sermons')
export class Sermon {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() title: string;
  @Column({ nullable: true }) pastor: string;
  @Column({ nullable: true }) date: string;
  @Column({ nullable: true }) series: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) youtube_link: string;
  @Column({ nullable: true }) duration: string;
  @Column({ nullable: true }) tags: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() title: string;
  @Column() message: string;
  @Column({ nullable: true }) audience: string;
  @Column({ nullable: true }) schedule_date: string;
  @Column({ default: 'sent' }) status: string;
  @Column({ default: false }) recurring: boolean;
  @CreateDateColumn() created_at: Date;
}

@Entity('ministries')
export class Ministry {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column({ nullable: true }) leader: string;
  @Column({ nullable: true }) leader_phone: string;
  @Column({ nullable: true }) meeting_day: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) emoji: string;
  @Column({ nullable: true }) color: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('ministry_members')
export class MinistryMember {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() ministry_id: string;
  @Column() church_id: string;
  @Column() full_name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) phone2: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) gender: string;
  @Column({ nullable: true }) date_of_birth: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) ministry_role: string;
  @Column({ nullable: true }) ministry_status: string;
  @Column({ nullable: true }) voice_part: string;
  @Column({ nullable: true }) instrument_played: string;
  @Column({ nullable: true }) date_joined_ministry: string;
  @Column({ nullable: true }) membership_status: string;
  @Column({ nullable: true }) baptism_status: string;
  @Column({ nullable: true }) cell_group: string;
  @Column({ nullable: true }) notes: string;
  @Column({ nullable: true }) photo_url: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('cell_groups')
export class CellGroup {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column({ nullable: true }) cell_group_id: string;
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) meeting_address: string;
  @Column({ nullable: true }) meeting_day: string;
  @Column({ nullable: true }) meeting_time: string;
  @Column({ nullable: true }) leader_name: string;
  @Column({ nullable: true }) leader_phone: string;
  @Column({ nullable: true }) leader_email: string;
  @Column({ nullable: true }) assistant_leader_name: string;
  @Column({ nullable: true }) host_name: string;
  @Column({ nullable: true }) color: string;
  @Column({ nullable: true }) date_created: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('cell_group_members')
export class CellGroupMember {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() cell_group_id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) phone2: string;
  @Column({ nullable: true }) role: string;
  @Column({ nullable: true }) date_joined: string;
  @Column({ default: 'Active' }) status: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('cell_attendance')
export class CellAttendance {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() cell_group_id: string;
  @Column() church_id: string;
  @Column() date: string;
  @Column({ nullable: true }) present: number;
  @Column({ nullable: true }) visitors: number;
  @Column({ nullable: true }) absentees: number;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('volunteers')
export class Volunteer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() name: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) phone2: string;
  @Column({ nullable: true }) email: string;
  @Column({ nullable: true }) team: string;
  @Column({ nullable: true }) role: string;
  @Column({ default: 'Active' }) status: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('counselling')
export class Counselling {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() member_name: string;
  @Column({ nullable: true }) member_phone: string;
  @Column() date: string;
  @Column() time: string;
  @Column({ nullable: true }) type: string;
  @Column({ default: 'pending' }) status: string;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('equipment_reports')
export class EquipmentReport {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() equipment_name: string;
  @Column({ nullable: true }) department: string;
  @Column() description: string;
  @Column({ nullable: true }) urgency: string;
  @Column({ default: 'Reported' }) status: string;
  @Column({ nullable: true }) reported_by: string;
  @Column({ nullable: true }) date_reported: string;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() item_name: string;
  @Column({ nullable: true }) department: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
  @Column({ nullable: true }) purchased_by: string;
  @Column({ nullable: true }) date_purchased: string;
  @Column({ nullable: true }) payment_method: string;
  @Column({ nullable: true }) vendor: string;
  @Column({ default: false }) approved: boolean;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() business_name: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) owner_name: string;
  @Column({ nullable: true }) owner_phone: string;
  @Column({ nullable: true }) owner_email: string;
  @Column({ nullable: true }) whatsapp: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) region: string;
  @Column({ nullable: true }) services_offered: string;
  @Column({ nullable: true }) price_range: string;
  @Column({ nullable: true }) momo_number: string;
  @Column({ nullable: true }) momo_name: string;
  @Column({ default: 'Pending' }) status: string;
  @Column({ nullable: true }) ref_number: string;
  @Column({ default: '3' }) commission_rate: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() title: string;
  @Column({ nullable: true }) artist: string;
  @Column({ nullable: true }) key: string;
  @Column({ nullable: true }) category: string;
  @Column({ nullable: true }) lyrics: string;
  @Column({ nullable: true }) youtube_link: string;
  @Column({ nullable: true }) tempo: string;
  @Column({ nullable: true }) language: string;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('payment_requests')
export class PaymentRequest {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() church_id: string;
  @Column() church_name: string;
  @Column() plan_requested: string;
  @Column({ nullable: true }) amount: string;
  @Column({ nullable: true }) payment_method: string;
  @Column({ nullable: true }) reference: string;
  @Column({ nullable: true }) proof_description: string;
  @Column({ default: 'pending' }) status: string;
  @CreateDateColumn() created_at: Date;
}

@Entity('platform_settings')
export class PlatformSettings {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) key: string;
  @Column({ type: 'text' }) value: string;
  @Column({ nullable: true }) updated_at: string;
}
