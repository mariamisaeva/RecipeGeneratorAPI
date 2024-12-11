import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Recipe } from './Recipe';
// import { FavoriteRecipe } from './FavoriteRecipe';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string; //UUID

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Recipe, (r) => r.author)
  recipes!: Recipe[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  //   @OneToMany(() => FavoriteRecipe, (fr) => fr.user)
  //   favoriteRecipes!: FavoriteRecipe[];
}
