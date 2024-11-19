import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecipeIngredient } from './RecipeIngredient';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient) //ingredient in RecipeIngredient
  recipeIngredients!: RecipeIngredient[];
}
