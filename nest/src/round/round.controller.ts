import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { RoundService } from './round.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { Round } from './entities/round.entity';
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';
import { ChangeVisibilityDto } from './dto/change-visibility.dto';
import { UpdateRoundDto } from './dto/update-round.dto';
import { TranslationGroup } from "./entities/translation.group";
import { CreateTranslationGroupDto } from "./dto/create-translation-group.dto";

@Controller('round')
export class RoundController {

  constructor(private roundService: RoundService) {
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createRound(@Body() createRoundDto: CreateRoundDto): Promise<ResponseApi<Round[]>> {
    try {
      await this.roundService.createRound(createRoundDto);
      const rounds = await this.roundService.getRoundByLeagueTypeId(createRoundDto.leagueTypeId);
      return new ResponseApiSuccess(rounds);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRound(@Body() updateRoundDto: UpdateRoundDto): Promise<ResponseApi<Round>> {
    const round = await this.roundService.getRoundById(updateRoundDto.id);
    if (!round) {
      throw new WebApiException(WebApiResponseCode.RoundNotFound, [updateRoundDto.id]);
    }
    try {
      const update = await this.roundService.updateRound(updateRoundDto, round);
      return new ResponseApiSuccess(update);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Put('change-visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async changeRoundVisibility(@Body() changeVisibilityDto: ChangeVisibilityDto): Promise<ResponseApi<Round>> {
    try {
      const round = await this.roundService.changeVisibilityOfRound(changeVisibilityDto);
      return new ResponseApiSuccess(round);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Get('translationGroups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getTranslationGroups(): Promise<ResponseApi<TranslationGroup[]>> {
    try {
      const translationGroups = await this.roundService.getTranslationGroups();
      return new ResponseApiSuccess(translationGroups);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Post('translationGroup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createTranslationGroup(@Body() dto: CreateTranslationGroupDto): Promise<ResponseApi<TranslationGroup>> {
    try {
      const translationGroups = await this.roundService.newTranslationGroup(dto);
      return new ResponseApiSuccess(translationGroups);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

  @Get('pendingRounds')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async getPendingRounds(@Req() req: RequestWithUser): Promise<ResponseApi<Round[]>> {
    const rounds = await this.roundService.getPendingRounds(req.user.userId);
    if (!rounds) {
      throw new WebApiException(WebApiResponseCode.Unexpected, []);
    }
    return new ResponseApiSuccess(rounds);
  }

  @Get('withMatches/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getRoundWithMatches(@Param() params: { id: number }): Promise<ResponseApi<Round>> {
    const round = await this.roundService.getRoundWithMatches(params.id);
    if (!round) {
      throw new WebApiException(WebApiResponseCode.RoundNotFound, [params.id]);
    }
    return new ResponseApiSuccess(round);
  }

  @Get(':id/:userId')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  async getRoundDetail(@Param() params: { id: number, userId: number}): Promise<ResponseApi<Round>> {
    const round = await this.roundService.getRoundDetail(params.id, params.userId);
    if (!round) {
      throw new WebApiException(WebApiResponseCode.RoundNotFound, [params.id]);
    }
    return new ResponseApiSuccess(round);
  }

}
