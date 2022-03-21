import { Module } from '@nestjs/common';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { AuthModule } from '../auth/auth.module';
import { Match } from '../match/entities/match.entity';
import { RoundModule } from "../round/round.module";
import { Round } from "../round/entities/round.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction, Match, Round]),
    AuthModule,
    RoundModule
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
  exports: [PredictionService]
})
export class PredictionModule {
}
