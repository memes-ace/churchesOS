import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Church, Member, Transaction, AttendanceRecord } from '../../entities';
import { ChurchesService } from './churches.service';
import { ChurchesController } from './churches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Church, Member, Transaction, AttendanceRecord])],
  providers: [ChurchesService],
  controllers: [ChurchesController],
  exports: [ChurchesService],
})
export class ChurchesModule {}
