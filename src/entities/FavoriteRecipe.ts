import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Recipe } from './Recipe';
import { User } from './User';

//M-T-M : User -> Many fav recipes , Recipe -> favorited by many users

@Entity()
export class FavoriteRecipe {
  @PrimaryGeneratedColumn()
  id!: number;

  //Many FavoriteRecipe can be favorited by one user
  //when a user is deleted,all their associated favorite recipes are also deleted automatically.
  @ManyToOne(() => User, (u) => u.favoriteRecipes, { onDelete: 'CASCADE' }) //favoriteRecipes in User
  user!: User;

  // Many FavoriteRecipe records can belong to one Recipe
  //   if a recipe is deleted,all FavoriteRecipe records referencing that recipe are also deleted automatically
  @ManyToOne(() => Recipe, (r) => r.favoritedBy, { onDelete: 'CASCADE' }) //favoritedBy in Recipe
  recipe!: Recipe;
}
