import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../../entities';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
