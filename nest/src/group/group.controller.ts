import { GroupService } from "./group.service";
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "src/auth/services/auth.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UserGroup } from "./entities/user-group.entity";
import { AddLeagueDto } from "./dto/add-league.dto";
import { JwtAuthGuard, RequestWithUser } from "../auth/guards/jwt/jwt-auth.guard";
import { ResponseApi, ResponseApiEmpty, ResponseApiSuccess, WebApiResponseCode } from "../utils/ResponseApi";
import { WebApiException } from "../utils/WebApiException";
import { doc } from "prettier";
import Group = doc.builders.Group;

@Controller("group")
export class GroupController {

  constructor(private groupService: GroupService,
              private authService: AuthService) {
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: RequestWithUser): Promise<ResponseApi<Group>> {
    try {
      const group = await this.groupService.createGroup(createGroupDto, req.user.userId);
      return new ResponseApiSuccess(group);
    } catch (e) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
    }
  }

  @Post("add-leagues")
  async addLeague(@Body() addLeagueDto: AddLeagueDto, @Req() req: RequestWithUser): Promise<ResponseApi<Group>> {
    try {
      const group = await this.groupService.addLeaguesToGroup(addLeagueDto.groupId, addLeagueDto.leagueTypeIds, req.user.userId);
      return new ResponseApiSuccess(group);
    } catch (e) {
      throw new WebApiException(WebApiResponseCode.Unexpected, [], e);
    }
  }

  @Post("join/:code")
  @UseGuards(JwtAuthGuard)
  async joinGroupByInvitationCode(@Param() params: { code: string }, @Req() req: RequestWithUser): Promise<ResponseApiEmpty> {
    try {
      const group = await this.groupService.addUserToGroupByInvitationCode(params.code, req.user.userId);
      return new ResponseApiEmpty();
    } catch (e) {
      if (e instanceof WebApiException) {
        throw e;
      } else {
        throw new WebApiException(WebApiResponseCode.Unexpected, []);
      }
    }
  }

  @Post("joinRandomGroup")
  @UseGuards(JwtAuthGuard)
  async joinRandomGroup(@Req() req: RequestWithUser): Promise<ResponseApiEmpty> {
    try {
      const group = await this.groupService.joinRandomGroup(req.user.userId);
      return new ResponseApiEmpty();
    } catch (e) {
      if (e instanceof WebApiException) {
        throw e;
      } else {
        throw new WebApiException(WebApiResponseCode.Unexpected, []);
      }
    }
  }
}
