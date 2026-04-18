import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ministry, MinistryMember } from '../../entities'
import { MinistriesService } from './ministries.service'
import { MinistriesController } from './ministries.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Ministry, MinistryMember])],
  providers: [MinistriesService],
  controllers: [MinistriesController],
})
export class MinistriesModule {}
