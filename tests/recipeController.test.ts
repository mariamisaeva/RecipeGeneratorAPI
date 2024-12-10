import { Request, Response } from 'express';
import {
  getAllRecipes,
  createRecipe,
} from '../src/controllers/recipeController';
import { AppDataSource } from '../src/config/database';
import { Recipe } from '../src/entities/Recipe';
import { handleIngredients, handleInstructions } from '../src/utils/helpers';
import { ILike } from 'typeorm';

jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('../src/utils/helpers', () => ({
  handleIngredients: jest.fn(),
  handleInstructions: jest.fn(),
}));

describe('getAllRecipes Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRecipeRepository: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRecipeRepository = {
      findAndCount: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockRecipeRepository,
    );
  });

  it('should return paginated recipes when found', async () => {
    mockRequest.query = {
      keyword: '',
      page: '1',
      limit: '10',
    };

    const mockRecipes = [
      { id: 1, title: 'Recipe 1' },
      { id: 2, title: 'Recipe 2' },
    ];

    mockRecipeRepository.findAndCount.mockResolvedValue([mockRecipes, 2]);

    await getAllRecipes(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Getting all recipes...',
      data: mockRecipes,
      pagination: {
        total: 2,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
      },
    });
  });

  it('should return 404 when no recipes are found', async () => {
    mockRequest.query = {
      keyword: '',
      page: '1',
      limit: '10',
    };

    mockRecipeRepository.findAndCount.mockResolvedValue([[], 0]);

    await getAllRecipes(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'No recipes found',
    });
  });

  it('should handle errors gracefully', async () => {
    mockRequest.query = {
      keyword: '',
      page: '1',
      limit: '10',
    };

    mockRecipeRepository.findAndCount.mockRejectedValue(
      new Error('Database error'),
    );

    await getAllRecipes(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database error',
    });
  });
});

//================================================================//
//CreateRecipe
describe('createRecipe Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRecipeRepository: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRecipeRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockRecipeRepository,
    );
  });

  it('should successfully create a recipe', async () => {
    mockRequest.body = {
      title: 'Chocolate Cake',
      description: 'Delicious cake',
      isVegetarian: true,
      servings: 8,
      time: '60',
      image: 'image_url',
      category: 'dessert',
      ingredients: [
        { ingredient: { name: 'Flour' }, quantity: 2, unit: 'cups' },
      ],
      instructions: [
        { instruction: { step: 'Mix ingredients' }, stepNumber: 1 },
      ],
    };

    const mockRecipe = { id: 1, title: 'Chocolate Cake' };
    const fullMockRecipe = { ...mockRecipe, ingredients: [], instructions: [] };

    mockRecipeRepository.create.mockReturnValue(mockRecipe);
    mockRecipeRepository.save.mockResolvedValue(mockRecipe);
    mockRecipeRepository.findOne.mockResolvedValue(fullMockRecipe);

    (handleIngredients as jest.Mock).mockResolvedValue([]);
    (handleInstructions as jest.Mock).mockResolvedValue([]);

    await createRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockRecipeRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Chocolate Cake',
        category: 'dessert',
      }),
    );
    expect(handleIngredients).toHaveBeenCalled();
    expect(handleInstructions).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recipe created successfully',
      data: fullMockRecipe,
    });
  });

  it('should return 400 for invalid category', async () => {
    mockRequest.body = {
      title: 'Chocolate Cake',
      category: 'invalid_category',
    };

    await createRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('Invalid category'),
    });
  });

  it('should return 500 for server error', async () => {
    mockRequest.body = {
      title: 'Chocolate Cake',
      category: 'dessert',
      ingredients: [],
      instructions: [],
    };

    mockRecipeRepository.create.mockImplementation(() => {
      throw new Error('Database error');
    });

    await createRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database error',
    });
  });
});
