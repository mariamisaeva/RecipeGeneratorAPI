export interface Recipe_TS {
  title: string;
  description?: string;
  isVegetarian: boolean;
  servings: number;
  time: string;
  image?: string;
  category?: string;
  //   recipeIngredients: string[];
  //   recipeInstructions: string[];
}
