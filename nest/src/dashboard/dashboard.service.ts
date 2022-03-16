import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { Group } from '../group/entities/group.entity';
import { Prediction } from "../prediction/entities/prediction.entity";
import { LeagueType } from "../league-type/entities/LeagueType.entity";
import { Team } from "../team/entities/team.entity";
import { Round } from "../round/entities/round.entity";

@Injectable()
export class DashboardService {

  constructor(@InjectRepository(User) private userRepo: Repository<User>,
              @InjectRepository(Match) private matchRepo: Repository<Match>,
              @InjectRepository(Group) private groupRepo: Repository<Group>,
              @InjectRepository(Prediction) private predictionRepo: Repository<Prediction>,
              @InjectRepository(LeagueType) private leagueRepo: Repository<LeagueType>,
              @InjectRepository(Team) private teamRepo: Repository<Team>,
              @InjectRepository(Round) private roundRepo: Repository<Round>) {
  }

  async getTotalUserCount(): Promise<number> {
    return this.userRepo.count();
  }

  async getTotalGroupCount(): Promise<number> {
    return this.groupRepo.count();
  }

  async getTotalTeamsCount(): Promise<number> {
    return this.teamRepo.count();
  }

  async getTotalLeaguesCount(): Promise<number> {
    return this.leagueRepo.count();
  }

  async getTotalPredictionsCount(): Promise<number> {
    return this.predictionRepo.count();
  }

  async getLiveMatches(): Promise<Match[]> {
    return this.matchRepo.createQueryBuilder('match')
      .leftJoinAndSelect('match.teams', 'teamMatch', 'teamMatch.matchId = match.id')
      .leftJoinAndSelect('teamMatch.team', 'team', 'teamMatch.teamId = team.Id')
      .where('match.finished = 0 AND match.startDate <= :currentDate', {currentDate: new Date()})
      .orderBy('match.startDate', 'ASC')
      .getMany();
  }

  async getNextRounds(userId: number): Promise<Round[]> {
    return this.roundRepo.createQueryBuilder("round")
      .where("round.startingDate > :now", { now: new Date() })
      .andWhere("round.visible = 1")
      .leftJoinAndSelect('round.league', 'league')
      .leftJoinAndSelect("round.translationGroup", "translationGroup")
      .leftJoinAndSelect("translationGroup.roundNames", "roundNames")
      .leftJoinAndSelect("round.matches", "match", "match.roundId = round.id")
      .addOrderBy("match.startDate", "ASC")
      .leftJoinAndSelect("match.predictions", "prediction", "prediction.userId = :userId", { userId })
      .leftJoinAndSelect("match.teams", "teamMatch")
      .addOrderBy("teamMatch.teamPosition", "ASC")
      .leftJoinAndSelect("teamMatch.team", "team", "team.id = teamMatch.teamId")
      .getMany();
  }
}
