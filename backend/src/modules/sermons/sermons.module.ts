import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sermon } from '../../entities'
import { SermonsService } from './sermons.service'
import { SermonsController } from './sermons.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Sermon])],
  providers: [SermonsService],
  controllers: [SermonsController],
})
export class SermonsModule {}
