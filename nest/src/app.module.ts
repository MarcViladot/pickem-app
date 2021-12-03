import { LeagueType } from './league-type/entities/LeagueType.entity';
import { UserGroup } from './group/entities/user-group.entity';
import { Group } from './group/entities/group.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
import { LeagueTypeModule } from './league-type/league-type.module';
import { RoundModule } from './round/round.module';
import { MatchModule } from './match/match.module';
import { Round } from './round/entities/round.entity';
import { Match } from './match/entities/match.entity';
import { TeamModule } from './team/team.module';
import { TeamMatch } from './match/entities/team-match.entity';
import { Team } from './team/entities/team.entity';
import { PredictionModule } from './prediction/prediction.module';
import { Prediction } from './prediction/entities/prediction.entity';
import { RoundResult } from './match/entities/round-result.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 8889,
      username: 'root',
      password: 'root',
      database: 'pickem',
      timezone: 'utc',
      entities: [User, Group, UserGroup, LeagueType, Round, Match, TeamMatch, Team, Prediction, RoundResult],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    GroupModule,
    LeagueTypeModule,
    RoundModule,
    MatchModule,
    TeamModule,
    PredictionModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
