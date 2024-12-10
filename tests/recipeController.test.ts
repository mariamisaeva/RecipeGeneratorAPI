import { Request, Response } from 'express';
import {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../src/controllers/recipeController';
import { AppDataSource } from '../src/config/database';
import { Recipe } from '../src/entities/Recipe';
import {
  handleIngredients,
  handleInstructions,
  handleUpdateIngredients,
  handleUpdateInstructions,
} from '../src/utils/helpers';
import { ILike } from 'typeorm';

jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock('../src/utils/helpers', () => ({
  handleIngredients: jest.fn(),
  handleInstructions: jest.fn(),
  handleUpdateIngredients: jest.fn(),
  handleUpdateInstructions: jest.fn(),
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

//================================================================//
//GetRecipeById
describe('getRecipeById Controller', () => {
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
      findOne: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockRecipeRepository,
    );
  });

  it('should return the recipe if found', async () => {
    mockRequest.params = { id: '1' };

    const mockRecipe = {
      id: 1,
      title: 'Pasta',
      ingredients: [],
      instructions: [],
    };

    mockRecipeRepository.findOne.mockResolvedValue(mockRecipe);

    await getRecipeById(mockRequest as Request, mockResponse as Response);

    expect(mockRecipeRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Getting recipe by id...',
      data: mockRecipe,
    });
  });

  it('should return 404 if the recipe is not found', async () => {
    mockRequest.params = { id: '2' };

    mockRecipeRepository.findOne.mockResolvedValue(null);

    await getRecipeById(mockRequest as Request, mockResponse as Response);

    expect(mockRecipeRepository.findOne).toHaveBeenCalledWith({
      where: { id: 2 },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Recipe not found',
    });
  });

  it('should return 500 if there is a server error', async () => {
    mockRequest.params = { id: '3' };

    mockRecipeRepository.findOne.mockRejectedValue(new Error('Database error'));

    await getRecipeById(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database error',
    });
  });
});

//================================================================//
// updateRecipe
describe('updateRecipe Controller', () => {
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
      findOne: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockRecipeRepository,
    );
  });

  it('should successfully update a recipe', async () => {
    mockRequest.params = { id: '1' };
    mockRequest.body = {
      title: 'Updated Recipe',
      category: 'dessert',
      ingredients: [
        { ingredient: { name: 'Sugar' }, quantity: 2, unit: 'tbsp' },
      ],
      instructions: [{ instruction: { step: 'Mix' }, stepNumber: 1 }],
    };

    const mockRecipe = {
      id: 1,
      title: 'Old Recipe',
      ingredients: [],
      instructions: [],
    };
    const updatedRecipe = {
      ...mockRecipe,
      title: 'Updated Recipe',
      category: 'dessert',
    };

    mockRecipeRepository.findOne.mockResolvedValue(mockRecipe);
    mockRecipeRepository.save.mockResolvedValue(updatedRecipe);

    (handleUpdateIngredients as jest.Mock).mockResolvedValue([]);
    (handleUpdateInstructions as jest.Mock).mockResolvedValue([]);

    await updateRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockRecipeRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });
    expect(mockRecipeRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated Recipe', category: 'dessert' }),
    );
    expect(handleUpdateIngredients).toHaveBeenCalled();
    expect(handleUpdateInstructions).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Recipe updated successfully',
      data: updatedRecipe,
    });
  });

  it('should return 404 if the recipe is not found', async () => {
    mockRequest.params = { id: '2' };
    mockRequest.body = { title: 'Updated Recipe' };

    mockRecipeRepository.findOne.mockResolvedValue(null);

    await updateRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockRecipeRepository.findOne).toHaveBeenCalledWith({
      where: { id: 2 },
      relations: [
        'ingredients',
        'ingredients.ingredient',
        'instructions',
        'instructions.instruction',
      ],
    });
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Recipe not found',
    });
  });

  it('should return 400 for invalid category', async () => {
    mockRequest.params = { id: '1' };
    mockRequest.body = { category: 'invalid_category' };

    const mockRecipe = { id: 1, title: 'Old Recipe' };

    mockRecipeRepository.findOne.mockResolvedValue(mockRecipe);

    await updateRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('Invalid category'),
    });
  });

  it('should return 500 for server error', async () => {
    mockRequest.params = { id: '3' };
    mockRequest.body = { title: 'Updated Recipe' };

    mockRecipeRepository.findOne.mockRejectedValue(new Error('Database error'));

    await updateRecipe(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database error',
    });
  });
});

//================================================================//
//DeleteRecipe
