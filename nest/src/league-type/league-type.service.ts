import { createLeagueTypeDto } from "./dto/create-league-type.dto";
import { LeagueType } from "./entities/LeagueType.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from "../group/entities/group.entity";

@Injectable()
export class LeagueTypeService {

    constructor(@InjectRepository(LeagueType) private leagueTypeRepository: Repository<LeagueType>,
                @InjectRepository(Group) private groupRepository: Repository<Group>) {
    }

    async getLeagueTypeById(id: number): Promise<LeagueType> {
        return this.leagueTypeRepository.findOne(id);
    }

    async getLeagueTypes(): Promise<LeagueType[]> {
        return this.leagueTypeRepository.find();
    }

    async createLeagueType(createLeagueTypeDto: createLeagueTypeDto): Promise<LeagueType | undefined> {
        return this.leagueTypeRepository.save(createLeagueTypeDto);
    }

    async getLeagueWithRounds(id: number): Promise<LeagueType | undefined> {
        return this.leagueTypeRepository.findOne(id, {
            relations: ['rounds']
        })
    }

    getGroupLeague(leagueId: number, userId: number): Promise<LeagueType> {
        return this.leagueTypeRepository.createQueryBuilder('league')
          .where('league.id = :leagueId', {leagueId})
          .leftJoinAndSelect('league.rounds', 'round')
          .orderBy('round.startingDate', 'ASC')
          .leftJoinAndSelect('round.matches', 'match', 'match.roundId = round.id')
          .leftJoinAndSelect('match.predictions', 'prediction', 'prediction.userId = :userId', {userId})
          .leftJoinAndSelect('match.teams', 'teamMatch')
          .orderBy('teamMatch.teamPosition', 'ASC')
          .leftJoinAndSelect('teamMatch.team', 'team', 'team.id = teamMatch.teamId')
          .getOne()
    }

    getGroupInfo(groupId: number, leagueId: number): Promise<Group> {
        return this.groupRepository.createQueryBuilder('group')
          .where('group.id = :groupId', {groupId})
          .leftJoinAndSelect('group.userGroups', 'userGroups', 'userGroups.groupId = group.id')
          .leftJoinAndSelect('userGroups.user', 'user', 'userGroups.userId = user.id')
          .leftJoinAndSelect('user.roundResults', 'roundResult', 'roundResult.userId = user.id AND roundResult.leagueTypeId = :leagueId', {leagueId})
          .getOne()
        /*.innerJoin('roundResult.round', 'round', 'roundResult.roundId = round.id')
          .andWhere('round.leagueTypeId = :leagueId', {leagueId})*/
    }

    calculateUserTotalPoints(group: Group, userId: number): number {
        const user = group.userGroups.find(ug => ug.user.id === userId).user;
        return user.roundResults.reduce((acc, round) => acc + round.points, 0)
    }
}
