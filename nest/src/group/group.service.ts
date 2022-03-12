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
import { UserEventService } from "../user-event/user-event.service";
import { UserEventType } from "../user-event/entities/user-event.entity";

@Injectable()
export class GroupService {

  constructor(@InjectRepository(Group) private groupRepository: Repository<Group>,
              private leagueService: LeagueTypeService,
              private userEventService: UserEventService,
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
    return this.getUserGroup(groupId, userId, ['group', 'group.leagues']);
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
    if (this.userIsAlreadyInGroup(group, userId)) {
      throw new WebApiException(WebApiResponseCode.UserAlreadyInGroup, null)
    }
    const newUserGroup = this.userGroupRepository.create({
      group,
      userId,
      userRole: UserRole.MEMBER
    });
    await this.userEventService.createEvent(userId, group.id, UserEventType.UserJoined);
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

  async updateUserRole(groupId: number, adminId: number, userId: number, newRole: UserRole): Promise<UserGroup> {
    const adminUserGroup = await this.getUserGroup(groupId, adminId);
    if (adminUserGroup.userRole !== UserRole.ADMIN && adminUserGroup.userRole !== UserRole.OWNER) {
      throw new WebApiException(WebApiResponseCode.NotAllowedToChangeRole, null);
    }
    const userGroup = await this.getUserGroup(groupId, userId);
    if (!userGroup) {
      throw new WebApiException(WebApiResponseCode.UserNotInGroup, [userId])
    }
    if (userGroup.userRole === UserRole.ADMIN && newRole === UserRole.MEMBER && adminUserGroup.userRole !== UserRole.OWNER) {
      throw new WebApiException(WebApiResponseCode.NotAllowedToChangeRole, null);
    }
    userGroup.userRole = newRole;
    // TODO UPPPPPPP
    await this.userEventService.createEvent(userId, groupId, UserEventType.UserRoleChangedAdmin);
    return this.userGroupRepository.save(userGroup);
  }

  private getUserGroup(groupId: number, userId: number, relations: string[] = []): Promise<UserGroup> {
    return this.userGroupRepository.findOne({
      where: {
        groupId,
        userId,
      },
      relations
    });
  }
}
