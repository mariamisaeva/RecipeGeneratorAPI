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
import { MinLength, IsEmail, Matches } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string; //UUID

  @Column({ unique: true })
  @MinLength(3, {
    message: 'Username is too short, must be at least 3 characters long',
  })
  username!: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Invalid email' })
  email!: string;

  @Column()
  @MinLength(6, {
    message: 'Password is too short, must be at least 6 characters long',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  password!: string;

  @OneToMany(() => Recipe, (r) => r.author)
  recipes!: Recipe[];

  @CreateDateColumn()
  createdAt!: Date;

  //   @OneToMany(() => FavoriteRecipe, (fr) => fr.user)
  //   favoriteRecipes!: FavoriteRecipe[];
}
