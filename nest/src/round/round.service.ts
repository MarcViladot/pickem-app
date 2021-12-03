import { Injectable } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { Round } from './entities/round.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeagueTypeService } from '../league-type/league-type.service';
import { ChangeVisibilityDto } from './dto/change-visibility.dto';
import { UpdateRoundDto } from './dto/update-round.dto';
import { Prediction } from "../prediction/entities/prediction.entity";

@Injectable()
export class RoundService {

  constructor(@InjectRepository(Round) private roundRepository: Repository<Round>,
              private leagueService: LeagueTypeService){
  }


  async createRound(createRoundDto: CreateRoundDto): Promise<Round | undefined> {
    const league = await this.leagueService.getLeagueTypeById(createRoundDto.leagueTypeId);
    const round = await this.roundRepository.create({
      name: createRoundDto.name,
      startingDate: createRoundDto.startingDate,
      league
    });
    return this.roundRepository.save(round);
  }


  async getRoundById(id: number): Promise<Round | undefined> {
    return this.roundRepository.findOne(id);
  }

  async getRoundWithMatches(id: number): Promise<Round | undefined> {
    return this.roundRepository.createQueryBuilder('round')
      .leftJoinAndSelect('round.matches', 'match', 'match.roundId = round.id')
      .orderBy("match.startDate", "ASC")
      .leftJoinAndSelect('match.teams', 'teamMatch', 'teamMatch.matchId = match.id')
      .addOrderBy('teamMatch.teamPosition', "ASC")
      .leftJoinAndSelect("teamMatch.team", 'team', 'teamMatch.teamId = team.id')
      .where('round.id = :id', {id: id})
      .getOne();
  }

  async getRoundDetail(id: number, userId: number): Promise<Round | undefined> {
    return this.roundRepository.createQueryBuilder('round')
        .where('round.id = :id', {id: id})
        .leftJoinAndSelect('round.roundResults', 'roundResult', 'roundResult.roundId = round.id AND roundResult.userId = :userId', { userId })
        .andWhere('round.visible = 1')
        .orderBy("round.startingDate", "ASC")
        .leftJoinAndSelect("round.matches", "match", "match.roundId = round.id")
        .addOrderBy("match.startDate", "ASC")
        .leftJoinAndSelect("match.predictions", "prediction", "prediction.userId = :userId", { userId })
        .leftJoinAndSelect("match.teams", "teamMatch")
        .addOrderBy("teamMatch.teamPosition", "ASC")
        .leftJoinAndSelect("teamMatch.team", "team", "team.id = teamMatch.teamId")
        .getOne();
  }

  async changeVisibilityOfRound(changeVisibilityDto: ChangeVisibilityDto): Promise<Round> {
    const round = await this.getRoundById(changeVisibilityDto.id);
    round.visible = changeVisibilityDto.visible;
    return this.roundRepository.save(round);
  }

  async getRoundByLeagueTypeId(leagueTypeId: number): Promise<Round[]> {
    return this.roundRepository.find({
      where: {
        league: {
          id: leagueTypeId
        }
      }
    })
  }

  async updateRound(updateRoundDto: UpdateRoundDto, round: Round): Promise<Round> {
    const updatedRound = {
      ...round,
      name: updateRoundDto.name,
      startingDate: updateRoundDto.startingDate,
      finished: updateRoundDto.finished
    }
    return this.roundRepository.save(updatedRound);
  }

  async getPendingRounds(userId: number): Promise<Round[]> {
    return this.roundRepository.createQueryBuilder('round')
      .where('round.finished = false')
      .andWhere('round.visible = true')
      .innerJoin('round.matches', 'match')
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('prediction.matchId')
          .from(Prediction, 'prediction')
          .where('prediction.userId = :userId', {userId: userId})
          .getQuery();
        return 'match.id NOT IN ' + subQuery;
      })
      .leftJoinAndSelect('round.league', 'league', 'round.leagueTypeId = league.id')
      .getMany();
  }
}
