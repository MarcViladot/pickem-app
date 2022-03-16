import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Group } from '../group/entities/group.entity';
import { Match } from '../match/entities/match.entity';
import { LeagueType } from "../league-type/entities/LeagueType.entity";
import { Prediction } from "../prediction/entities/prediction.entity";
import { Team } from "../team/entities/team.entity";
import { Round } from "../round/entities/round.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, Match, LeagueType, Prediction, Team, Round])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
