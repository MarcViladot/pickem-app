import { Test, TestingModule } from '@nestjs/testing';
import { LeagueTypeController } from './league-type.controller';

describe('LeagueTypeController', () => {
  let controller: LeagueTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueTypeController],
    }).compile();

    controller = module.get<LeagueTypeController>(LeagueTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
