import { createLeagueTypeDto } from "./dto/create-league-type.dto";
import { LeagueType } from "./entities/LeagueType.entity";
import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { LeagueTypeService } from "./league-type.service";
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../user/entities/user.entity";
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from "../utils/ResponseApi";
import { WebApiException } from "../utils/WebApiException";
import { RoundResult } from "../match/entities/round-result.entity";



@Controller("league")
export class LeagueTypeController {

    constructor(private leagueService: LeagueTypeService) {
    }

    @Get("")
    async getLeagueTypes(): Promise<ResponseApi<LeagueType[]>> {
        const leagues = await this.leagueService.getLeagueTypes();
        return new ResponseApiSuccess(leagues);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getLeagueWithRounds(@Param() id: number): Promise<ResponseApi<LeagueType>> {
        const league = await this.leagueService.getLeagueWithRounds(id);
        if (!league) {
            throw new WebApiException(WebApiResponseCode.LeagueNotFound, [id]);
        }
        return new ResponseApiSuccess(league);
    }

    @Get("getGroupLeague/:groupId/:leagueId")
    @UseGuards(JwtAuthGuard)
    async getGroupLeague(@Req() req: RequestWithUser, @Param() params: { groupId: number, leagueId: number }): Promise<ResponseApi<LeagueType>> {
        const leagueInfo = await this.leagueService.getGroupLeague(params.leagueId, req.user.userId);
        const groupInfo = await this.leagueService.getGroupInfo(params.groupId, params.leagueId);
        const table = groupInfo.userGroups.map((userGroup) => userGroup.user.roundResults);
        const data = {
            totalPoints: this.leagueService.calculateUserTotalPoints(groupInfo, req.user.userId),
            leagueInfo,
            groupInfo,
            table: this.leagueService.getClassificationTableInfo(table)
        };
        return new ResponseApiSuccess(data);
    }

    @Post("createLeagueType")
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
