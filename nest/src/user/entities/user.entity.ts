import { UserGroup } from '../../group/entities/user-group.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Prediction } from '../../prediction/entities/prediction.entity';
import { RoundResult } from "../../match/entities/round-result.entity";
import { Expose } from 'class-transformer';

export enum UserRole {
  MEMBER = 0,
  ADMIN = 1
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column({default: ''})
  photo: string;

  @Column({select: false})
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  userRole: UserRole;

  @OneToMany(() => UserGroup, userGroup => userGroup.user)
  userGroups: UserGroup[];

  @OneToMany(() => Prediction, prediction => prediction.user)
  predictions: Prediction[];

  @OneToMany(() => RoundResult, roundResult => roundResult.user)
  roundResults: RoundResult[];

  token: string;

}
