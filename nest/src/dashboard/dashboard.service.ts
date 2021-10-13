import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Match } from '../match/entities/match.entity';
import { Group } from '../group/entities/group.entity';

@Injectable()
export class DashboardService {

  constructor(@InjectRepository(User) private userRepo: Repository<User>,
              @InjectRepository(Match) private matchRepo: Repository<Match>,
              @InjectRepository(Group) private groupRepo: Repository<Group>) {
  }

  async getTotalUserCount(): Promise<number> {
    return this.userRepo.count();
  }

  async getTotalGroupCount(): Promise<number> {
    return this.groupRepo.count();
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
