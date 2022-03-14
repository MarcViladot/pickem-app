import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class TeamService {

  constructor(@InjectRepository(Team) private teamRepository: Repository<Team>){
  }

  async createTeam(createTeamDto: CreateTeamDto): Promise<Team | undefined> {
    const team = await this.teamRepository.create(createTeamDto);
    return this.teamRepository.save(team);
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamRepository.find({
      order: {
        name: "ASC",
      },
    });
  }

  async getTeamById(id: number): Promise<Team | undefined> {
    return this.teamRepository.findOne(id);
  }


}
