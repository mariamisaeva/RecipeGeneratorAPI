import { Request, Response } from 'express';
import { getAllRecipes } from '../src/controllers/recipeController';
import { AppDataSource } from '../src/config/database';
import { Recipe } from '../src/entities/Recipe';
import { ILike } from 'typeorm';

jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
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
