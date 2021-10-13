import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
import { UpdateResultDto } from './dto/update-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';
import { Round } from '../round/entities/round.entity';
import { RoundService } from '../round/round.service';
import { UpdateMatchDto } from './dto/update-match.dto';

@Controller('match')
export class MatchController {

  constructor(private matchService: MatchService,
              private roundService: RoundService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createMatch(@Body() createMatchDto: CreateMatchDto): Promise<ResponseApi<Round>> {
    try {
      const match = await this.matchService.createMatch(createMatchDto);
      const roundWithMatches = await this.roundService.getRoundWithMatches(match.roundId);
      return new ResponseApiSuccess(roundWithMatches);
    } catch (e) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
    }
  }

  @Put('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateMatch(@Body() updateMatchDto: UpdateMatchDto): Promise<ResponseApi<Match>> {
    const match = await this.matchService.getMatchById(updateMatchDto.id);
    if (!match) {
      throw new WebApiException(WebApiResponseCode.MatchNotFound, [updateMatchDto.id]);
    }
    try {
      const matchUpdate = await this.matchService.updateMatch(updateMatchDto, match);
      return new ResponseApiSuccess(matchUpdate);
    } catch (e) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
    }
  }

  @Put('update-result')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateMatchResult(@Body() updateResultDto: UpdateResultDto): Promise<ResponseApi<Match>> {
    try {
      const match = await this.matchService.updateMatchResult(updateResultDto.matchId, updateResultDto.localResult, updateResultDto.awayResult);
      return new ResponseApiSuccess(match);
    } catch (e) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
    }
  }

  @Get(':id')
  async getMatch(@Param() id: number): Promise<ResponseApi<Match>> {
    const match = await this.matchService.getMatchById(id);
    if (!match) {
      throw new WebApiException(WebApiResponseCode.MatchNotFound, [id]);
    }
    return new ResponseApiSuccess(match);
  }

  @Delete(':id')
  async deleteMatch(@Param() params: { id: number }): Promise<ResponseApiEmpty> {
    const match = await this.matchService.getMatchById(params.id);
    if (!match) {
      throw new WebApiException(WebApiResponseCode.MatchNotFound, [params.id]);
    }
    if (match.finished) {
      throw new WebApiException(WebApiResponseCode.MatchAlreadyFinished, []);
    }
    await this.matchService.deleteMatch(match);
    return new ResponseApiEmpty();
  }
}
