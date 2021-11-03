import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from '../../round/entities/round.entity';
import { TeamMatch } from './team-match.entity';
import { Prediction } from '../../prediction/entities/prediction.entity';

@Entity()
export class Match {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ default: false })
  finished: boolean;

  @Column({ default: false })
  doublePoints: boolean;

  @Column({default: false})
  cancelled: boolean;

  @ManyToOne(() => Round, round => round.id)
  @JoinColumn({ name: 'roundId' })
  round: Round;

  @Column()
  roundId: number;

  @OneToMany(() => TeamMatch, teamMatch => teamMatch.match, {
    onDelete: 'CASCADE',
  })
  teams: TeamMatch[];

  @OneToMany(() => Prediction, prediction => prediction.match, {
    onDelete: 'CASCADE',
  })
  predictions: Prediction[];
}
