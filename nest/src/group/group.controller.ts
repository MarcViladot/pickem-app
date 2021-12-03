import { GroupService } from './group.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UserGroup } from './entities/user-group.entity';
import { AddLeagueDto } from './dto/add-league.dto';
import { JwtAuthGuard, RequestWithUser } from '../auth/guards/jwt/jwt-auth.guard';
import { ResponseApi, ResponseApiSuccess, WebApiResponseCode } from '../utils/ResponseApi';
import { WebApiException } from '../utils/WebApiException';

@Controller('group')
export class GroupController {

    constructor(private groupService: GroupService,
                private authService: AuthService) {
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: RequestWithUser): Promise<ResponseApi<UserGroup>> {
        try {
            const group = await this.groupService.createGroup(createGroupDto, req.user.userId);
            return new ResponseApiSuccess(group);
        } catch (e) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
        }
    }

    @Post('add-league')
    async addLeague(@Body() addLeagueDto: AddLeagueDto): Promise<ResponseApi<UserGroup>> {
        try {
            const group = await this.groupService.addLeagueToGroup(addLeagueDto.groupId, addLeagueDto.leagueTypeId);
            return new ResponseApiSuccess(group);
        } catch (e) {
            throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
        }
    }
}
