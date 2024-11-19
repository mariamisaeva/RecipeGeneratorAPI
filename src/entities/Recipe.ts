import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Instruction } from './Instruction';
import { RecipeIngredient } from './RecipeIngredient';
import { User } from './User';
import { FavoriteRecipe } from './FavoriteRecipe';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number; //Primary key

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false })
  isVegetarian!: boolean;

  @Column({ default: 1 })
  servings!: number;

  @Column()
  time!: string;

  @Column({ default: 'no-image.png' })
  image!: string;

  @Column({ default: 'other' })
  category!: string;

  //OneToMany relationship with RecipeIngredient
  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe) //recipe in RecipeIngredient
  recipeIngredients!: RecipeIngredient[];

  @ManyToMany(() => Instruction, (step) => step.recipes)
  @JoinTable()
  instructions!: Instruction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (u) => u.recipes, { onDelete: 'CASCADE' })
  author!: User; //User who created the recipe

  @Column({ default: 0 })
  favCounter!: number;

  @OneToMany(() => FavoriteRecipe, (fr) => fr.recipe)
  favoritedBy: FavoriteRecipe[] = [];
}
