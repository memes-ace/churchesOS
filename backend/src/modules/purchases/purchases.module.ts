import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Purchase } from '../../entities'
import { PurchasesService } from './purchases.service'
import { PurchasesController } from './purchases.controller'
@Module({ imports: [TypeOrmModule.forFeature([Purchase])], providers: [PurchasesService], controllers: [PurchasesController] })
export class PurchasesModule {}
