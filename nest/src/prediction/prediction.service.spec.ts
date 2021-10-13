import { Test, TestingModule } from '@nestjs/testing';
import { PredictionService } from './prediction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/prediction.entity';
import { Match } from '../match/entities/match.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { LeagueType } from '../league-type/entities/LeagueType.entity';

describe('PredictionService', () => {
  let service: PredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Prediction, Match]),
        AuthModule
      ],
      providers: [PredictionService],
    }).compile();

    service = module.get<PredictionService>(PredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
