import { createLeagueTypeDto } from '../league-type/dto/create-league-type.dto';
import { LeagueType } from '../league-type/entities/LeagueType.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LeagueTypeService {

    constructor(@InjectRepository(LeagueType) private leagueTypeRepository: Repository<LeagueType>) {
    }

    async getLeagueTypeById(id: number): Promise<LeagueType> {
        return this.leagueTypeRepository.findOne(id);
    }

    async getLeagueTypes(): Promise<LeagueType[]> {
        return this.leagueTypeRepository.find();
    }

    async createLeagueType(createLeagueTypeDto: createLeagueTypeDto): Promise<LeagueType | undefined> {
        return this.leagueTypeRepository.save(createLeagueTypeDto);
    }

    async getLeagueWithRounds(id: number): Promise<LeagueType | undefined> {
        return this.leagueTypeRepository.findOne(id, {
            relations: ['rounds']
        })
    }
}
