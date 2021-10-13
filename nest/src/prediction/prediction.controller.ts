import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { AuthService } from '../auth/services/auth.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { Prediction } from './entities/prediction.entity';
import { JwtAuthGuard, RequestWithUser } from '../auth/guards/jwt/jwt-auth.guard';
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';

@Controller('prediction')
export class PredictionController {

  constructor(private predictionService: PredictionService,
              private authService: AuthService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPrediction(@Body() createPredictionDto: CreatePredictionDto, @Req() req: RequestWithUser): Promise<ResponseApi<Prediction>> {
    try {
      const user = await this.authService.getUserFromRequest(req);
      const prediction = this.predictionService.createPrediction(createPredictionDto, user);
      return new ResponseApiSuccess(prediction);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

}
