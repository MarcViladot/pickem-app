import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamMatch } from '../../match/entities/team-match.entity';

@Entity()
export  class Team {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  crest: string;

  @OneToMany(() => TeamMatch, teamMatch => teamMatch.team)
  teams: TeamMatch[];

}
