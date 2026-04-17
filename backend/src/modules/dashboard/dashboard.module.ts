import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, AttendanceRecord, Transaction, ChurchEvent, Church } from '../../entities';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
@Module({
  imports: [TypeOrmModule.forFeature([Member, AttendanceRecord, Transaction, ChurchEvent, Church])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
