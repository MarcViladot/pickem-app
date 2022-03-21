import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PredictionService } from "./prediction.service";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { Prediction } from "./entities/prediction.entity";
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from "../utils/ResponseApi";
import { WebApiException } from "../utils/WebApiException";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";
import { RoundService } from "../round/round.service";
import { Round } from "../round/entities/round.entity";

@Controller("prediction")
export class PredictionController {

  constructor(private predictionService: PredictionService,
              private roundService: RoundService) {
  }

  /*@Post()
  @UseGuards(JwtAuthGuard)
  async createPrediction(@Body() createPredictionDto: CreatePredictionDto, @Req() req: RequestWithUser): Promise<ResponseApi<Prediction>> {
    try {
      const prediction = this.predictionService.createPrediction(createPredictionDto, req.user.userId);
      return new ResponseApiSuccess(prediction);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }*/

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRoundPrediction(@Body() createPredictionsDto: CreatePredictionDto[], @Req() req: RequestWithUser): Promise<ResponseApi<Round>> {
    try {
      await this.predictionService.createRoundPrediction(createPredictionsDto, req.user.userId);
      const updatedRound = await this.roundService.getRoundDetail(createPredictionsDto[0].roundId, req.user.userId);
      return new ResponseApiSuccess(updatedRound);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updatePrediction(@Body() updatePredictionDto: UpdatePredictionDto, @Req() req: RequestWithUser): Promise<ResponseApi<Prediction>> {
    try {
      const prediction = this.predictionService.updatePrediction(updatePredictionDto);
      return new ResponseApiSuccess(prediction);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

}
