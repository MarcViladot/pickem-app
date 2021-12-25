import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Prediction } from "./entities/prediction.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { TeamMatch } from "../match/entities/team-match.entity";
import { Match } from "../match/entities/match.entity";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";

@Injectable()
export class PredictionService {

  constructor(@InjectRepository(Prediction) private predictionRepository: Repository<Prediction>,
              @InjectRepository(Match) private matchRepository: Repository<Match>) {
  }

  async createPrediction(createPredictionDto: CreatePredictionDto, userId: number): Promise<Prediction> {
    const prediction = await this.predictionRepository.create({
      localTeamResult: createPredictionDto.localTeamResult,
      awayTeamResult: createPredictionDto.awayTeamResult,
      matchId: createPredictionDto.matchId,
      userId,
      points: 0
    });
    return this.predictionRepository.save(prediction);
  }

  async createRoundPrediction(createPredictionsDto: CreatePredictionDto[], userId: number): Promise<Prediction[]> {
    const predictions: Prediction[] = createPredictionsDto.map(createPredictionDto => {
      return {
        localTeamResult: createPredictionDto.localTeamResult,
        awayTeamResult: createPredictionDto.awayTeamResult,
        matchId: createPredictionDto.matchId,
        userId
      };
    });
    return this.predictionRepository.save<Prediction>(predictions);
  }

  async updatePrediction(updatePredictionDto: UpdatePredictionDto, userId: number): Promise<UpdateResult> {
    return this.predictionRepository.update({ id: updatePredictionDto.id }, {
      localTeamResult: updatePredictionDto.localTeamResult,
      awayTeamResult: updatePredictionDto.awayTeamResult
    });
  }

  async correctPrediction(prediction: Prediction, match: Match, localTeam: TeamMatch, awayTeam: TeamMatch): Promise<Prediction> {
    const points = this.getPredictionPoints(localTeam.finalResult, awayTeam.finalResult, prediction.localTeamResult, prediction.awayTeamResult);
    prediction = {
      ...prediction,
      correct: points === 2 || points === 4,
      points: match.doublePoints ? points * 2 : points
    };
    await this.predictionRepository.save(prediction);
    return this.predictionRepository.findOne(prediction.id, { relations: ["user"] });
  }


  private getPredictionPoints(realLocalResult: number, realAwayResult: number, predLocalResult: number, predAwayResult: number): number {
    // TODO PENDING TO TEST
    if ((realLocalResult === predLocalResult) && (realAwayResult === predAwayResult)) {
      return 4;
    } else if (realLocalResult === realAwayResult) {
      return 0;
    } else if ((realLocalResult > realAwayResult) === (predLocalResult > predAwayResult)) {
      return 2;
    }
    return 0;
  }

  async getTotalPointsFromRound(roundId: number, userId: number): Promise<{ totalPoints: number }> {
    return await this.predictionRepository.createQueryBuilder("prediction")
      .select("SUM(prediction.points) AS totalPoints")
      .leftJoin("prediction.match", "match", "prediction.matchId = match.id AND match.roundId = :roundId", { roundId: roundId })
      .where("prediction.userId = :userId", { userId: userId })
      .getRawOne();
  }
}
