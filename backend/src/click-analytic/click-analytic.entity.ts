// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
// import { Url } from '../urls/url.entity';

// @Entity()
// export class ClickAnalytics {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Url, (url) => url.id, { onDelete: 'CASCADE' })
//   url: Url;

//   @Column()
//   ipAddress: string;

//   @CreateDateColumn()
//   clickedAt: Date;
// }
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Url } from '../urls/url.entity';

@Entity()
export class ClickAnalytics {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Url, (url) => url.clicks, { onDelete: 'CASCADE' })
  url: Url;

  @Column()
  ipAddress: string;

  @CreateDateColumn()
  clickedAt: Date;
}
