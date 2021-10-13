import { UserGroup } from '../../group/entities/user-group.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Round } from '../../round/entities/round.entity';

@Entity()
export class LeagueType {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  logo: string;

  @Column({unique: true})
  name: string;

  @ManyToMany(() => UserGroup)
  @JoinTable()
  groups: [];

  @OneToMany(() => Round, round => round.league)
  rounds: Round[]

}
