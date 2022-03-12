import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User, UserRole } from "../../user/entities/user.entity";
import { Group } from "../../group/entities/group.entity";

export enum UserEventType {
  UserRemoved = "UserRemoved",
  UserJoined = "UserJoined",
  UserLeft = "UserLeft",
  UserRoleChangedAdmin = "UserRoleChangedAdmin",
  UserRoleChangedMember = "UserRoleChangedMember",
}

@Entity()
export class UserEvent {

  constructor(userId: number, groupId: number, type: UserEventType) {
    this.date = new Date();
    this.userId = userId;
    this.groupId = groupId;
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: number;

  @Column()
  userId: number;

  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn({ name: "groupId" })
  group: number;

  @Column()
  groupId: number;

  @Column({ type: 'enum', enum: UserEventType})
  type: string;

  @CreateDateColumn()
  date: Date;
}
