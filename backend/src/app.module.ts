import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { MembersModule } from './modules/members/members.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { FinanceModule } from './modules/finance/finance.module'
import { EventsModule } from './modules/events/events.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { VisitorsModule } from './modules/visitors/visitors.module'
import { PrayerModule } from './modules/prayer/prayer.module'
import { SermonsModule } from './modules/sermons/sermons.module'
import { AnnouncementsModule } from './modules/announcements/announcements.module'
import { MinistriesModule } from './modules/ministries/ministries.module'
import { CellGroupsModule } from './modules/cellgroups/cellgroups.module'
import { EquipmentModule } from './modules/equipment/equipment.module'
import { PurchasesModule } from './modules/purchases/purchases.module'
import { SongsModule } from './modules/songs/songs.module'
import { CounsellingModule } from './modules/counselling/counselling.module'
import { VendorsModule } from './modules/vendors/vendors.module'
import { ChurchesModule } from './modules/churches/churches.module'
import { EmailModule } from './modules/email/email.module'
import { VolunteersModule } from './modules/volunteers/volunteers.module'
import { AiModule } from './modules/ai/ai.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    VolunteersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: { rejectUnauthorized: false },
      logging: false,
    }),
    AuthModule,
    MembersModule,
    AttendanceModule,
    FinanceModule,
    EventsModule,
    DashboardModule,
    VisitorsModule,
    PrayerModule,
    SermonsModule,
    AnnouncementsModule,
    MinistriesModule,
    CellGroupsModule,
    EquipmentModule,
    PurchasesModule,
    SongsModule,
    CounsellingModule,
    VendorsModule,
    ChurchesModule,
    AiModule,
  ],
})
export class AppModule {}
