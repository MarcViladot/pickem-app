import { createLeagueTypeDto } from "./dto/create-league-type.dto";
import { LeagueType } from "./entities/LeagueType.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "../group/entities/group.entity";
import { RoundResult } from "../match/entities/round-result.entity";
import { ClassificationTableInfo, GroupedTableByUser } from "./interfaces/league.interface";

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
            relations: ["rounds"]
        });
    }

    getGroupLeague(leagueId: number, userId: number): Promise<LeagueType> {
        return this.leagueTypeRepository.createQueryBuilder("league")
          .where("league.id = :leagueId", { leagueId })
          .leftJoinAndSelect("league.rounds", "round")
          .where('round.visible = 1')
          .orderBy("round.startingDate", "ASC")
          .leftJoinAndSelect("round.matches", "match", "match.roundId = round.id")
          .addOrderBy("match.startDate", "ASC")
          .leftJoinAndSelect("match.predictions", "prediction", "prediction.userId = :userId", { userId })
          .leftJoinAndSelect("match.teams", "teamMatch")
          .addOrderBy("teamMatch.teamPosition", "ASC")
          .leftJoinAndSelect("teamMatch.team", "team", "team.id = teamMatch.teamId")
          .getOne();
    }

    getGroupInfo(groupId: number, leagueId: number): Promise<Group> {
        return this.groupRepository.createQueryBuilder("group")
          .where("group.id = :groupId", { groupId })
          .leftJoinAndSelect("group.userGroups", "userGroups", "userGroups.groupId = group.id")
          .leftJoinAndSelect("userGroups.user", "user", "userGroups.userId = user.id")
          .leftJoinAndSelect("user.roundResults", "roundResult", "roundResult.userId = user.id AND roundResult.leagueTypeId = :leagueId", { leagueId })
          .getOne();
    }

    calculateUserTotalPoints(group: Group, userId: number): number {
        const user = group.userGroups.find(ug => ug.user.id === userId).user;
        return user.roundResults.reduce((acc, round) => acc + round.points, 0);
    }

    // Get classification table
    getClassificationTableInfo(roundResultsMatrix: RoundResult[][]): ClassificationTableInfo {
        const groupTable = this.getRoundResultsGrouped(roundResultsMatrix);
        return {
            byRounds: groupTable,
            global: this.getRoundGlobalTable(roundResultsMatrix)
        };
    }

    private getRoundGlobalTable(tableGroupedByUsers: RoundResult[][]): GroupedTableByUser[] {
        const arr: GroupedTableByUser[] = tableGroupedByUsers.map((roundResultsOfUser) => this.getGroupedTableByUser(roundResultsOfUser));
        return arr.sort((a, b) => b.totalPoints - a.totalPoints);
    }

    private getGroupedTableByUser(roundResults: RoundResult[]): GroupedTableByUser {
        return {
            userId: roundResults[0].userId,
            totalPoints: roundResults.reduce((acc, curr) => acc + curr.points, 0)
        };
    };

    private getRoundResultsGrouped(roundResults: RoundResult[][]): any {
        return roundResults.reduce((acc, roundResults) => {
            const roundId = roundResults[0].roundId;
            if (!acc[roundId]) {
                acc[roundId] = [];
            }
            return this.addAndSort(acc, roundResults, roundId);
        }, {});
    }

    private addAndSort(acc: any, cur: RoundResult[], roundId: number): any {
        const group = Object.assign({}, acc);
        group[roundId] = group[roundId].concat(cur).sort((a, b) => b.points - a.points);
        return group;
    }
}
