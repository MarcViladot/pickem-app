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

  async createGroup(createGroupDto: CreateGroupDto, user: User): Promise<Group | undefined> {
    const invitationCode = ArrayTools.generateRandomString(6);
    const group = await this.groupRepository.create({
      name: createGroupDto.name,
      invitationCode,
    });
    await this.groupRepository.save(createGroupDto);
    const joinGroup = {
      group: group,
      user,
      userRole: UserRole.OWNER,
    };
    await this.userGroupRepository.save(joinGroup);
    return group;
  }

  async addLeagueToGroup(userGroupId: number, leagueTypeId: number): Promise<UserGroup | undefined> {
    const userGroup = await this.userGroupRepository.findOne(userGroupId);
    const league = await this.leagueService.getLeagueTypeById(leagueTypeId);
    userGroup.leagues.push(league);
    return this.userGroupRepository.save(userGroup);
  }
}
