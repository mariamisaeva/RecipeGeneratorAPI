import { AppDataSource } from '../config/database';
import { Ingredient_TS } from '../types/types';
import { Ingredient } from '../entities/Ingredient';
import { RecipeIngredient } from '../entities/RecipeIngredient';

/* Process ingredients and return RecipeIngredient array.
- grab repos
- create an empty array type RecipeIngredient[]
- loop through ingredients
- grab the ingredient fineOne by name

- create new recipe in the repo with destructured data
- add to array
- return
*/

//Ingredient - RecipeIngredient
export const handleIngredients = async (
  ingredients: Ingredient_TS[],
): Promise<RecipeIngredient[]> => {
  const ingredientsRepository = AppDataSource.getRepository(Ingredient);
  const recipeIngredientRepository =
    AppDataSource.getRepository(RecipeIngredient);

  const newIngredients: RecipeIngredient[] = [];

  for (const { name, quantity, unit } of ingredients) {
    let singleIngredient = await ingredientsRepository.findOneBy({ name });

    if (!singleIngredient) {
      singleIngredient = ingredientsRepository.create({ name });
      await ingredientsRepository.save(singleIngredient);
    }

    //create RI object
    const RI = recipeIngredientRepository.create({
      ingredient: singleIngredient,
      quantity,
      unit,
    });

    newIngredients.push(RI);
  }

  return newIngredients;
};
