import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {


  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save({ ...createUserDto });
  }

  async updateUserPhoto(userId: number, photoUrl: string): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    user.photo = photoUrl;
    return this.userRepository.save(user);
  }

  async findUserById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne(userId);
  }

  async getCurrentUser(uid: string): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.uid = :uid', {uid})
      .leftJoinAndSelect('user.userGroups', 'userGroup', 'userGroup.userId = user.id')
      .leftJoinAndSelect('userGroup.group', 'group', 'userGroup.groupId = group.id')
      .leftJoinAndSelect('group.leagues', 'leagueType')
      .getOne()
  }


  async getCurrentUserAdmin(userId: number): Promise<User> {
    return this.userRepository.findOne(userId, {
      relations: ['userGroups', 'userGroups.group'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['userGroups', 'userGroups.group']
    });
  }
}
