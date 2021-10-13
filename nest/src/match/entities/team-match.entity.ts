import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from './match.entity';
import { Team } from '../../team/entities/team.entity';

export enum TeamPosition {
  LOCAL = 0,
  AWAY = 1
}

@Entity()
export class TeamMatch {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  finalResult: number;

  @Column({ type: 'enum', enum: TeamPosition, nullable: true })
  teamPosition: TeamPosition;

  @ManyToOne(() => Team, team => team.id, {
    eager: true
  })
  @JoinColumn({name: 'teamId'})
  team: Team;

  @Column()
  teamId: number;

  @ManyToOne(() => Match, match => match.id, {
  onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'matchId'})
  match: Match;

}
