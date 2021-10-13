import { UserGroup } from './user-group.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Group {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  photo: string;

  @Column({nullable: true, unique: true})
  invitationCode: string

  @OneToMany(() => UserGroup, userGroup => userGroup.group)
  userGroups: UserGroup[];
}
