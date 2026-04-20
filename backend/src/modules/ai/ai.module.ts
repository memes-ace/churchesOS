import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Church, Member, Transaction, AttendanceRecord } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Church, Member, Transaction, AttendanceRecord])],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
