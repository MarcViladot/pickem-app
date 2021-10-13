import { Group } from './group.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { LeagueType } from 'src/league-type/entities/LeagueType.entity';

export enum UserRole {
  MEMBER = 0,
  ADMIN = 1,
  OWNER = 2,
  PENDING = 3,
}

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  userRole: number;

  @ManyToMany(() => LeagueType, (leagueType) => leagueType.groups, {
    eager: true,
  })
  @JoinTable()
  leagues: LeagueType[];
}
