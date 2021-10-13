import { createLeagueTypeDto } from '../league-type/dto/create-league-type.dto';
import { LeagueType } from '../league-type/entities/LeagueType.entity';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LeagueTypeService } from './league-type.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';

@Controller('league')
export class LeagueTypeController {

    constructor(private leagueService: LeagueTypeService) {
    }

    @Get('')
    async getLeagueTypes(): Promise<ResponseApi<LeagueType[]>> {
        const leagues = await this.leagueService.getLeagueTypes();
        return new ResponseApiSuccess(leagues);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getLeagueWithRounds(@Param() id: number): Promise<ResponseApi<LeagueType>> {
        const league = await this.leagueService.getLeagueWithRounds(id);
        if (!league) {
            throw new WebApiException(WebApiResponseCode.LeagueNotFound, [id]);
        }
        return new ResponseApiSuccess(league);
    }


    @Post('createLeagueType')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async createLeagueType(@Body() createLeagueTypeDto: createLeagueTypeDto): Promise<ResponseApi<LeagueType[]>> {
        try {
            await this.leagueService.createLeagueType(createLeagueTypeDto);
            const leagues = await this.leagueService.getLeagueTypes();
            return new ResponseApiSuccess(leagues);
        } catch (e) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
        }
    }
}
