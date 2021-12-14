import { UserGroup } from '../../group/entities/user-group.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Prediction } from '../../prediction/entities/prediction.entity';
import { RoundResult } from "../../match/entities/round-result.entity";

export enum UserRole {
  MEMBER = 0,
  ADMIN = 1
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  uid: string;

  @Column()
  name: string;

  @Column({default: ''})
  photo: string;

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

  firebaseUser?: any;

}
