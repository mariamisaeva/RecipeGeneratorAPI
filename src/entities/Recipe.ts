import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { RecipeInstruction } from './RecipeInstruction';
import { RecipeIngredient } from './RecipeIngredient';
import { User } from './User';
import { FavoriteRecipe } from './FavoriteRecipe';

export enum CategoryEnum {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Snack = 'snack',
  Dessert = 'dessert',
  Drink = 'drink',
  Soup = 'soup',
  Salad = 'salad',
  Bread = 'bread',
  Sauce = 'sauce',
  IceCream = 'ice-cream',
  FastFood = 'fast-food',
  Sandwich = 'sandwich',
  Other = 'other',
}

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

  @Column({
    type: 'enum',
    enum: CategoryEnum,
    default: CategoryEnum.Other,
  })
  category!: CategoryEnum;

  //OneToMany relationship with RecipeIngredient
  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe) //recipe in RecipeIngredient
  ingredients!: RecipeIngredient[];

  @OneToMany(() => RecipeInstruction, (inst) => inst.recipe)
  instructions!: RecipeInstruction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (u) => u.recipes, { onDelete: 'CASCADE' })
  author!: User; //User who created the recipe

  @Column({ default: 0 })
  favCounter!: number;

  @OneToMany(() => FavoriteRecipe, (fr) => fr.recipe)
  favoritedBy!: FavoriteRecipe[];
}
