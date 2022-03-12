import { LeagueType } from "./league-type/entities/LeagueType.entity";
import { UserGroup } from "./group/entities/user-group.entity";
import { Group } from "./group/entities/group.entity";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "./user/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { GroupModule } from "./group/group.module";
import { LeagueTypeModule } from "./league-type/league-type.module";
import { RoundModule } from "./round/round.module";
import { MatchModule } from "./match/match.module";
import { Round } from "./round/entities/round.entity";
import { Match } from "./match/entities/match.entity";
import { TeamModule } from "./team/team.module";
import { TeamMatch } from "./match/entities/team-match.entity";
import { Team } from "./team/entities/team.entity";
import { PredictionModule } from "./prediction/prediction.module";
import { Prediction } from "./prediction/entities/prediction.entity";
import { RoundResult } from "./match/entities/round-result.entity";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ConfigModule } from "@nestjs/config";
import { FirebaseAuthService } from "./auth/services/firebase-auth.service";
import { TranslationGroup } from "./round/entities/translation.group";
import { RoundName } from "./round/entities/round.name";
import { UserEventModule } from './user-event/user-event.module';
import { UserEvent } from "./user-event/entities/user-event.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "127.0.0.1",
      port: 8889,
      username: "root",
      password: "root",
      database: "pickem",
      timezone: "utc",
      entities: [User, Group, UserGroup, LeagueType, Round, Match, TeamMatch, Team, Prediction, RoundResult,
        TranslationGroup, RoundName, UserEvent],
      synchronize: true
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    GroupModule,
    LeagueTypeModule,
    RoundModule,
    MatchModule,
    TeamModule,
    PredictionModule,
    DashboardModule,
    UserEventModule
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthService]
})
export class AppModule {
}
