import { createLeagueTypeDto } from "./dto/create-league-type.dto";
import { LeagueType } from "./entities/LeagueType.entity";
import { Body, ConsoleLogger, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { LeagueTypeService } from "./league-type.service";
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { User, UserRole } from "../user/entities/user.entity";
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from "../utils/ResponseApi";
import { WebApiException } from "../utils/WebApiException";
import { RoundService } from "../round/round.service";
import { Group } from "../group/entities/group.entity";
import { Round } from "../round/entities/round.entity";
import { LeagueEvent, RoundEvent } from "./interfaces/league.interface";

@Controller("league")
export class LeagueTypeController {

    constructor(private leagueService: LeagueTypeService,
                private roundService: RoundService) {
    }

    @Get("")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getLeagueTypes(): Promise<ResponseApi<LeagueType[]>> {
        const leagues = await this.leagueService.getLeagueTypes();
        return new ResponseApiSuccess(leagues);
    }

    @Get("visible")
    @UseGuards(JwtAuthGuard)
    async getVisibleLeagueTypes(): Promise<ResponseApi<LeagueType[]>> {
        const leagues = await this.leagueService.getVisibleLeagueTypes();
        return new ResponseApiSuccess(leagues);
    }

    @Put(`:id/change-visibility/:visible`)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateLeagueVisibility(@Param() params: {id: number, visible: boolean}): Promise<ResponseApiEmpty> {
        try {
            await this.leagueService.updateLeagueVisibility(params.id, Boolean(params.visible));
            return new ResponseApiEmpty();
        } catch (e) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
        }
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
        try {
            const nextRound: Round = await this.roundService.getNextRound(req.user.userId, params.leagueId);
            const leagueInfo: LeagueType = await this.leagueService.getGroupLeague(params.leagueId, req.user.userId);
            const groupInfo: Group = await this.leagueService.getGroupInfo(params.groupId, params.leagueId);
            const users: User[] = groupInfo.userGroups.map((userGroup) => userGroup.user);
            const roundsHistory: Round[] = await this.roundService.getLeagueHistory(params.leagueId, users.map((user) => user.id));
            const roundEvents: RoundEvent[] = this.leagueService.getRoundEvents(roundsHistory, users);
            const leagueEvents: LeagueEvent[] = this.leagueService.getLeagueEvents(groupInfo.events, roundEvents);
            const data = {
                homeInfo: {
                    nextRound: nextRound || null,
                    events: leagueEvents
                },
                totalPoints: this.leagueService.calculateUserTotalPoints(groupInfo, req.user.userId),
                leagueInfo,
                groupInfo,
                table: this.leagueService.getClassificationTableInfo(users)
            };
            return new ResponseApiSuccess(data);
        } catch (e) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
        }
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
