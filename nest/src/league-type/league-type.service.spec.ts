import { Test, TestingModule } from '@nestjs/testing';
import { LeagueTypeService } from './league-type.service';

describe('LeagueTypeService', () => {
  let service: LeagueTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeagueTypeService],
    }).compile();

    service = module.get<LeagueTypeService>(LeagueTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
