import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { Match } from '../match/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Match])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
