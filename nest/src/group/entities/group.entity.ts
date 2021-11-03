import { UserGroup } from "./user-group.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

}
