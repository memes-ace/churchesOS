import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CellGroup, CellGroupMember, CellAttendance } from '../../entities'
import { CellGroupsService } from './cellgroups.service'
import { CellGroupsController } from './cellgroups.controller'

@Module({
  imports: [TypeOrmModule.forFeature([CellGroup, CellGroupMember, CellAttendance])],
  providers: [CellGroupsService],
  controllers: [CellGroupsController],
})
export class CellGroupsModule {}
