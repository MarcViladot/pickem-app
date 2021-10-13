import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';

@Controller('team')
export class TeamController {

  constructor(private teamService: TeamService) {
  }

  @Get()
  async getAllTeams(): Promise<ResponseApi<Team[]>> {
    const teams = await this.teamService.getAllTeams();
    return new ResponseApiSuccess(teams);
  }

  @Post()
  async createTeam(@Body() createTeamDto: CreateTeamDto): Promise<ResponseApi<Team>> {
    try {
      const team = await this.teamService.createTeam(createTeamDto);
      return new ResponseApiSuccess(team);
    } catch (error) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], error);
    }
  }

}
