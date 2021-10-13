import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { TeamMatch } from './entities/team-match.entity';
import { TeamModule } from '../team/team.module';
import { RoundModule } from '../round/round.module';
import { PredictionModule } from '../prediction/prediction.module';
import { RoundResult } from './entities/round-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, TeamMatch, RoundResult]), TeamModule, RoundModule, PredictionModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
