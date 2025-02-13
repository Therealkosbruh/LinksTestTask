// import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

// @Entity()
// export class Url {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   shortUrl: string;

//   @Column()
//   originalUrl: string;

//   @Column({ nullable: true })
//   expiresAt?: Date;

//   @Column({ unique: true, nullable: true, length: 20, type: 'varchar' })
//   alias?: string | null;
  
//   @CreateDateColumn()
//   createdAt: Date;

//   @Column({ default: 0 })
//   clickCount: number;
// }
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ClickAnalytics } from '../click-analytic/click-analytic.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  shortUrl: string;

  @Column()
  originalUrl: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @Column({ unique: true, nullable: true, length: 20, type: 'varchar' })
  alias?: string | null;
  
  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  clickCount: number;

  @OneToMany(() => ClickAnalytics, (click) => click.url, { cascade: true })
  clicks: ClickAnalytics[];
}
