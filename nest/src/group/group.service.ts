import { CreateGroupDto } from "./dto/create-group.dto";
import { UserGroup, UserRole } from "./entities/user-group.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "./entities/group.entity";
import { LeagueTypeService } from "../league-type/league-type.service";
import { ArrayTools } from "../utils/ArrayTools";
import { WebApiException } from "../utils/WebApiException";
import { WebApiResponseCode } from "../utils/ResponseApi";

@Injectable()
export class GroupService {

  constructor(@InjectRepository(Group) private groupRepository: Repository<Group>,
              private leagueService: LeagueTypeService,
              @InjectRepository(UserGroup) private userGroupRepository: Repository<UserGroup>) {
  }

  async createGroup(createGroupDto: CreateGroupDto, userId: number): Promise<Group | undefined> {
    const invitationCode = ArrayTools.generateRandomString(6);
    const group = await this.groupRepository.save({
      name: createGroupDto.name,
      private: createGroupDto.private,
      invitationCode,
    });
    const joinGroup = {
      group,
      userId,
      userRole: UserRole.OWNER,
    };
    await this.userGroupRepository.save(joinGroup);
    return group;
  }

  async addLeaguesToGroup(groupId: number, leagueTypeIds: number[], userId: number): Promise<UserGroup | undefined> {
    const group = await this.groupRepository.findOne(groupId);
    const leagues = await this.leagueService.getLeaguesTypeByIds(leagueTypeIds);
    group.leagues = group.leagues.concat(leagues);
    await this.groupRepository.save(group);
    return this.userGroupRepository.findOne({
      where: {
        groupId,
        userId
      },
      relations: ['group', 'group.leagues'],
    });
  }

  async addUserToGroupByInvitationCode(code: string, userId: number): Promise<UserGroup> {
    const group = await this.groupRepository.findOne({
      where: {
        invitationCode: code,
      },
      relations: ["userGroups"],
    });
    if (!group) {
      throw new WebApiException(WebApiResponseCode.GroupNotFound, [code])
    }
    if (this.requestAlreadySent(group, userId)) {
      throw new WebApiException(WebApiResponseCode.RequestAlreadySent, null)
    }
    if (this.userIsAlreadyInGroup(group, userId)) {
      throw new WebApiException(WebApiResponseCode.UserAlreadyInGroup, null)
    }
    const newUserGroup = this.userGroupRepository.create({
      group,
      userId,
      userRole: UserRole.PENDING
    });
    // TODO SEND NOTIFICATION TO OWNER OR ADMIN OF THE GROUP
    return this.userGroupRepository.save(newUserGroup);
  }

  private userIsAlreadyInGroup(group: Group, userId: number): boolean {
    return group.userGroups.map((users: UserGroup) => users.userId).includes(userId);
  }

  private requestAlreadySent(group: Group, userId: number): boolean {
    return group.userGroups.some((userGroup: UserGroup) => userGroup.userId === userId && userGroup.userRole === UserRole.PENDING);
  }

  async joinRandomGroup(userId: number): Promise<UserGroup> {
    return null;
  }
}
