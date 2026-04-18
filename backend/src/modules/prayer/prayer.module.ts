import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PrayerRequest } from '../../entities'
import { PrayerService } from './prayer.service'
import { PrayerController } from './prayer.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PrayerRequest])],
  providers: [PrayerService],
  controllers: [PrayerController],
})
export class PrayerModule {}
