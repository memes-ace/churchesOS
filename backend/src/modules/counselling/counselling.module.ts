import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Counselling } from '../../entities'
import { CounsellingService } from './counselling.service'
import { CounsellingController } from './counselling.controller'
@Module({ imports: [TypeOrmModule.forFeature([Counselling])], providers: [CounsellingService], controllers: [CounsellingController] })
export class CounsellingModule {}
