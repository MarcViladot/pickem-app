import { Injectable } from "@nestjs/common";
import { CreateRoundDto } from "./dto/create-round.dto";
import { Round } from "./entities/round.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LeagueTypeService } from "../league-type/league-type.service";
import { ChangeVisibilityDto } from "./dto/change-visibility.dto";
import { UpdateRoundDto } from "./dto/update-round.dto";
import { Prediction } from "../prediction/entities/prediction.entity";
import { TranslationGroup } from "./entities/translation.group";
import { CreateTranslationGroupDto, RoundNameDto } from "./dto/create-translation-group.dto";
import { RoundName } from "./entities/round.name";

@Injectable()
export class RoundService {

  constructor(@InjectRepository(Round) private roundRepository: Repository<Round>,
              @InjectRepository(TranslationGroup) private translationGroupRepository: Repository<TranslationGroup>,
              @InjectRepository(RoundName) private roundNameRepository: Repository<RoundName>) {
  }

  async getTranslationGroups(): Promise<TranslationGroup[]> {
    return await this.translationGroupRepository.find({
      relations: ['roundNames']
    });
  }

  async newTranslationGroup(createTranslationGroupDto: CreateTranslationGroupDto): Promise<TranslationGroup> {
    const group = await this.translationGroupRepository.save({
      groupName: createTranslationGroupDto.name
    });
    const roundNames: RoundName[] = createTranslationGroupDto.rounds.map((roundName: RoundNameDto) => {
      return {
        text: roundName.text,
        lang: roundName.lang,
        translationGroupId: group.id
      }
    });
    const savedRoundNames = await this.roundNameRepository.save(roundNames);
    group.roundNames = savedRoundNames;
    return await this.translationGroupRepository.save(group);
  }

  async createRound(createRoundDto: CreateRoundDto): Promise<Round | undefined> {
    const round = await this.roundRepository.create({
      name: createRoundDto.name,
      startingDate: createRoundDto.startingDate,
      translationGroupId: createRoundDto.translationGroupId,
      translationNameExtra: createRoundDto.translationNameExtra,
      leagueTypeId: createRoundDto.leagueTypeId,
    });
    return this.roundRepository.save(round);
  }

  async getRoundById(id: number): Promise<Round | undefined> {
    return this.roundRepository.findOne(id);
  }

  async getRoundWithMatches(id: number): Promise<Round | undefined> {
    return this.roundRepository.createQueryBuilder("round")
      .leftJoinAndSelect("round.translationGroup", "translationGroup")
      .leftJoinAndSelect("translationGroup.roundNames", "roundNames")
      .leftJoinAndSelect("round.matches", "match", "match.roundId = round.id")
      .orderBy("match.startDate", "ASC")
      .leftJoinAndSelect("match.teams", "teamMatch", "teamMatch.matchId = match.id")
      .addOrderBy("teamMatch.teamPosition", "ASC")
      .leftJoinAndSelect("teamMatch.team", "team", "teamMatch.teamId = team.id")
      .where("round.id = :id", { id: id })
      .getOne();
  }

  async getRoundDetail(id: number, userId: number): Promise<Round | undefined> {
    return this.roundRepository.createQueryBuilder("round")
      .where("round.id = :id", { id: id })
      .leftJoinAndSelect("round.translationGroup", "translationGroup")
      .leftJoinAndSelect("translationGroup.roundNames", "roundNames")
      .leftJoinAndSelect("round.roundResults", "roundResult", "roundResult.roundId = round.id AND roundResult.userId = :userId", { userId })
      .andWhere("round.visible = 1")
      .orderBy("round.startingDate", "ASC")
      .leftJoinAndSelect("round.matches", "match", "match.roundId = round.id")
      .addOrderBy("match.startDate", "ASC")
      .leftJoinAndSelect("match.predictions", "prediction", "prediction.userId = :userId", { userId })
      .leftJoinAndSelect("match.teams", "teamMatch")
      .addOrderBy("teamMatch.teamPosition", "ASC")
      .leftJoinAndSelect("teamMatch.team", "team", "team.id = teamMatch.teamId")
      .getOne();
  }

  async getNextRound(userId: number, leagueId: number): Promise<Round | undefined> {
    return this.roundRepository.createQueryBuilder("round")
      .where("round.leagueTypeId = :leagueId", { leagueId: leagueId })
      .andWhere("round.startingDate > :now", { now: new Date() })
      .andWhere("round.visible = 1")
      .leftJoinAndSelect("round.translationGroup", "translationGroup")
      .leftJoinAndSelect("translationGroup.roundNames", "roundNames")
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
    });
  }

  async updateRound(updateRoundDto: UpdateRoundDto, round: Round): Promise<Round> {
    const updatedRound = {
      ...round,
      name: updateRoundDto.name,
      startingDate: updateRoundDto.startingDate,
      finished: updateRoundDto.finished,
      finishedAt: updateRoundDto.finished ? new Date() : null,
    };
    return this.roundRepository.save(updatedRound);
  }

  async getPendingRounds(userId: number): Promise<Round[]> {
    return this.roundRepository.createQueryBuilder("round")
      .where("round.finished = false")
      .andWhere("round.visible = true")
      .leftJoinAndSelect('round.translationGroup', 'translationGroup')
      .leftJoinAndSelect('translationGroup.roundNames', 'roundNames')
      .innerJoin("round.matches", "match")
      .andWhere(qb => {
        const subQuery = qb.subQuery()
          .select("prediction.matchId")
          .from(Prediction, "prediction")
          .where("prediction.userId = :userId", { userId: userId })
          .getQuery();
        return "match.id NOT IN " + subQuery;
      })
      .leftJoinAndSelect("round.league", "league", "round.leagueTypeId = league.id")
      .getMany();
  }

  async getLeagueHistory(leagueId: number, userIds: number[]): Promise<Round[]> {
    return this.roundRepository.createQueryBuilder("round")
      .where("round.leagueTypeId = :leagueId", { leagueId: leagueId })
      .andWhere("round.finished = true")
      .andWhere("round.visible = true")
      .leftJoinAndSelect('round.translationGroup', 'translationGroup')
      .leftJoinAndSelect('translationGroup.roundNames', 'roundNames')
      .leftJoinAndSelect("round.roundResults", "roundResult", "roundResult.roundId = round.id AND roundResult.userId IN (:userIds)", { userIds })
      .leftJoinAndSelect("round.league", "league", "round.leagueTypeId = league.id")
      .orderBy("round.startingDate", "DESC")
      .getMany();
  }


}
