export interface Recipe_TS {
  id?: number;
  title: string;
  description?: string;
  isVegetarian: boolean;
  servings: number;
  time: string;
  image?: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author: {
    userId: string;
    username: string;
  };
  ingredients: Ingredient_TS[];
  instructions: Instruction_TS[];
}

export interface Ingredient_TS {
  id?: number;
  ingredient: { id?: number; name: string };
  quantity: number;
  unit: string;
  //   indexNumber: number;
}

export interface Instruction_TS {
  id?: number;
  stepNumber: number;
  instruction: { id?: number; step: string };
}

export interface RecipeQueryParams {
  keyword?: string;
  page?: Number;
  limit?: Number;
  category?: string;
  isVegetarian?: string;
  time?: string;
}

export interface PaginationMetadata {
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface GetAllRecipesResponse {
  success: boolean;
  message: string;
  data: Recipe_TS[];
  pagination: PaginationMetadata;
}

export interface User_TS {
  id?: number;
  username: string;
  email: string;
  password: string;
  recipes: Recipe_TS[];
  createdAt: Date;
}

export interface FavoriteRecipe_TS {
  id?: number;
  user: { id: number; username: string };
  recipe: Recipe_TS;
}
