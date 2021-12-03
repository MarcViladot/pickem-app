import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {


  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async findUserByEmailWithPass(email: string): Promise<User | undefined> {
    // return this.userRepository.findOne({email});
    return this.userRepository.createQueryBuilder('user').where("user.email = :email", { email }).addSelect('user.password').getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
    const password = await bcrypt.hash(createUserDto.password, 10);
    return this.userRepository.save({ ...createUserDto, password });
  }

  async findUserById(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne(userId);
  }

  async getCurrentUser(userId: number): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.id = :userId', {userId})
      .leftJoinAndSelect('user.userGroups', 'userGroup', 'userGroup.userId = :userId', {userId})
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
