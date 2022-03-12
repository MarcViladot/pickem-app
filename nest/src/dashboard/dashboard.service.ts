import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { Group } from '../group/entities/group.entity';
import { Prediction } from "../prediction/entities/prediction.entity";
import { LeagueType } from "../league-type/entities/LeagueType.entity";
import { Team } from "../team/entities/team.entity";

@Injectable()
export class DashboardService {

  constructor(@InjectRepository(User) private userRepo: Repository<User>,
              @InjectRepository(Match) private matchRepo: Repository<Match>,
              @InjectRepository(Group) private groupRepo: Repository<Group>,
              @InjectRepository(Prediction) private predictionRepo: Repository<Prediction>,
              @InjectRepository(LeagueType) private leagueRepo: Repository<LeagueType>,
              @InjectRepository(Team) private teamRepo: Repository<Team>) {
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

}
