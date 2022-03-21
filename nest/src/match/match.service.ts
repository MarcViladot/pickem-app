import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { TeamMatch, TeamPosition } from './entities/team-match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { TeamService } from '../team/team.service';
import { RoundService } from '../round/round.service';
import { PredictionService } from '../prediction/prediction.service';
import { Prediction } from '../prediction/entities/prediction.entity';
import { RoundResult } from './entities/round-result.entity';
import { User } from '../user/entities/user.entity';
import { Round } from '../round/entities/round.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UpdateMatchDto } from './dto/update-match.dto';


@Injectable()
export class MatchService {

  constructor(@InjectRepository(Match) private matchRepository: Repository<Match>,
              @InjectRepository(TeamMatch) private teamMatchRepository: Repository<TeamMatch>,
              @InjectRepository(RoundResult) private roundResultRepository: Repository<RoundResult>,
              private teamService: TeamService,
              private roundService: RoundService,
              private predictionService: PredictionService) {
  }

  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    const match = await this.matchRepository.create({
      startDate: createMatchDto.startDate,
      roundId: createMatchDto.roundId,
      doublePoints: createMatchDto.doublePoints,
    });
    await this.matchRepository.save(match);
    await this.createTeamMatch(createMatchDto.localTeamId, TeamPosition.LOCAL, match);
    await this.createTeamMatch(createMatchDto.awayTeamId, TeamPosition.AWAY, match);
    return match;
  }

  async createTeamMatch(teamId: number, teamPosition: TeamPosition, match: Match): Promise<TeamMatch> {
    const teamMatch = this.teamMatchRepository.create({
      teamId,
      teamPosition,
      match,
    });
    return this.teamMatchRepository.save(teamMatch);
  }

  async updateMatchResult(matchId: number, localResult: number, awayResult: number): Promise<Match> {
    const match: Match = await this.matchRepository.findOne(matchId, {
        relations: ['predictions', 'round', 'teams'],
      },
    );
    const localTeam = await this.updateTeamMatchResult(match.teams.find(t => t.teamPosition === TeamPosition.LOCAL), localResult);
    const awayTeam = await this.updateTeamMatchResult(match.teams.find(t => t.teamPosition === TeamPosition.AWAY), awayResult);
    for (let i = 0; i < match.predictions.length; i++) {
      const prediction: Prediction = await this.predictionService.correctPrediction(match.predictions[i], match, localTeam, awayTeam);
      await this.updateRoundResult(prediction.user, match.round);
    }
    return this.matchRepository.save({
      ...match,
      finished: true,
    });
  }

  private async updateTeamMatchResult(teamMatch: TeamMatch, finalResult: number): Promise<TeamMatch> {
    return this.teamMatchRepository.save({
      ...teamMatch,
      finalResult,
    });
  }

  private async updateRoundResult(user: User, round: Round): Promise<RoundResult> {
    const roundResult = await this.roundResultRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        round: {
          id: round.id,
        },
      },
    });
    const { totalPoints } = await this.predictionService.getTotalPointsFromRound(round.id, user.id);
    console.log('totalPoints: ', totalPoints);
    if (roundResult) {
      return this.roundResultRepository.save({
        ...roundResult,
        points: +totalPoints,
      });
    } else {
      const newRoundResult = this.roundResultRepository.create({
        user,
        round,
        leagueTypeId: round.leagueTypeId,
        points: +totalPoints,
      });
      return this.roundResultRepository.save(newRoundResult);
    }
  }

  getMatchById(id: number): Promise<Match | undefined> {
    return this.matchRepository.findOne(id);
  }

  async deleteMatch(match: Match): Promise<DeleteResult> {
    return this.matchRepository.delete(match);
  }

  async updateMatch(updateMatchDto: UpdateMatchDto, match: Match): Promise<Match> {
    const updatedMatch = {
      ...match,
      finished: updateMatchDto.finished,
      doublePoints: updateMatchDto.doublePoints,
      startDate: updateMatchDto.startDate,
      postponed: updateMatchDto.postponed
    };
    return this.matchRepository.save(updatedMatch);
  }
}
