import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PredictionService } from "./prediction.service";
import { CreatePredictionDto } from "./dto/create-prediction.dto";
import { Prediction } from "./entities/prediction.entity";
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from "../utils/ResponseApi";
import { WebApiException } from "../utils/WebApiException";
import { UpdatePredictionDto } from "./dto/update-prediction.dto";

@Controller("prediction")
export class PredictionController {

  constructor(private predictionService: PredictionService) {
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
  async createRoundPrediction(@Body() createPredictionsDto: CreatePredictionDto[], @Req() req: RequestWithUser): Promise<ResponseApi<Prediction[]>> {
    try {
      const predictions = this.predictionService.createRoundPrediction(createPredictionsDto, req.user.userId);
      return new ResponseApiSuccess(predictions);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updatePrediction(@Body() updatePredictionDto: UpdatePredictionDto, @Req() req: RequestWithUser): Promise<ResponseApi<Prediction>> {
    try {
      const prediction = this.predictionService.updatePrediction(updatePredictionDto, req.user.userId);
      return new ResponseApiSuccess(prediction);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

}
