import { UserGroup } from "./user-group.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LeagueType } from "src/league-type/entities/LeagueType.entity";

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  isContest: boolean;

  @Column({ nullable: true, unique: true })
  invitationCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserGroup, userGroup => userGroup.group)
  userGroups: UserGroup[];

  @ManyToMany(() => LeagueType, (leagueType) => leagueType.groups, {
    eager: true
  })
  @JoinTable()
  leagues: LeagueType[];

}
