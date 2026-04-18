import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EquipmentReport } from '../../entities'
import { EquipmentService } from './equipment.service'
import { EquipmentController } from './equipment.controller'
@Module({ imports: [TypeOrmModule.forFeature([EquipmentReport])], providers: [EquipmentService], controllers: [EquipmentController] })
export class EquipmentModule {}
