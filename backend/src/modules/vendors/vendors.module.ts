import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Vendor } from '../../entities'
import { VendorsService } from './vendors.service'
import { VendorsController } from './vendors.controller'
@Module({ imports: [TypeOrmModule.forFeature([Vendor])], providers: [VendorsService], controllers: [VendorsController] })
export class VendorsModule {}
