import { CreateGroupDto } from './dto/create-group.dto';
import { UserGroup, UserRole } from './entities/user-group.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { User } from 'src/user/entities/user.entity';
import { LeagueTypeService } from '../league-type/league-type.service';
import { ArrayTools } from '../utils/ArrayTools';

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

  async addLeagueToGroup(groupId: number, leagueTypeId: number): Promise<Group | undefined> {
    const group = await this.groupRepository.findOne(groupId);
    const league = await this.leagueService.getLeagueTypeById(leagueTypeId);
    group.leagues.push(league);
    return this.groupRepository.save(group);
  }
}
