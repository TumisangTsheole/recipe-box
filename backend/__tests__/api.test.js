const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
let app;
let recipes; // Declare recipes in a scope accessible to beforeEach

// Define an initial set of recipes for testing purposes
const initialRecipes = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Consistent UUID for testing
    title: 'Classic Chocolate Chip Cookies',
    description: 'Chewy and delicious homemade cookies',
    imageUrl: null,
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    category: 'dessert',
    tags: ['dessert', 'baking', 'comfort-food'],
    rating: 4,
    ingredients: [
      { id: uuidv4(), name: 'all-purpose flour', amount: '2.25', unit: 'cups', order: 1 },
      { id: uuidv4(), name: 'butter', amount: '1', unit: 'cup', order: 2 },
      { id: uuidv4(), name: 'chocolate chips', amount: '2', unit: 'cups', order: 3 },
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Mix butter and sugars until creamy',
      'Add eggs and vanilla, beat well',
      'Combine dry ingredients separately',
      'Gradually blend into butter mixture',
      'Stir in chocolate chips',
      'Drop by rounded tablespoons onto cookie sheets',
      'Bake 9-11 minutes until golden brown',
    ],
    notes: 'Great with a glass of milk!',
    isFavorite: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210', // Consistent UUID for testing
    title: 'Spicy Chicken Stir-Fry',
    description: 'A quick and flavorful weeknight meal',
    imageUrl: null,
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    category: 'dinner',
    tags: ['spicy', 'quick', 'asian'],
    rating: 5,
    ingredients: [
      { id: uuidv4(), name: 'chicken breast', amount: '1.5', unit: 'lb', order: 1 },
      { id: uuidv4(), name: 'broccoli florets', amount: '3', unit: 'cups', order: 2 },
      { id: uuidv4(), name: 'soy sauce', amount: '1/4', unit: 'cup', order: 3 },
      { id: uuidv4(), name: 'sriracha', amount: '1', unit: 'tbsp', order: 4 },
    ],
    instructions: [
      'Slice chicken and vegetables',
      'Heat oil in a large skillet or wok',
      'Stir-fry chicken until cooked through',
      'Add vegetables and cook until tender-crisp',
      'Whisk together soy sauce and sriracha, add to pan',
      'Serve hot over rice',
    ],
    notes: null,
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

beforeEach(() => {
  jest.resetModules(); // Clear the module cache
  const server = require('../server'); // Re-import the app and recipes
  app = server;
  // Reset the recipes array to its initial state for each test
  server.recipes = JSON.parse(JSON.stringify(initialRecipes));
  recipes = server.recipes;
});

describe('Recipe API', () => {
  const API_BASE = '/api/v1';

  it('GET /recipes should return all recipes', async () => {
    const res = await request(app).get(`${API_BASE}/recipes`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0); // Assuming initial recipes are loaded
  });

  it('GET /recipes/:id should return a single recipe', async () => {
    // Get an existing recipe ID
    const allRecipesRes = await request(app).get(`${API_BASE}/recipes`);
    const existingRecipeId = allRecipesRes.body[0].id;

    const res = await request(app).get(`${API_BASE}/recipes/${existingRecipeId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', existingRecipeId);
  });

  it('GET /recipes/:id should return 404 for a non-existent recipe', async () => {
    const res = await request(app).get(`${API_BASE}/recipes/${uuidv4()}`); // Use a random ID
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Recipe not found');
  });

  it('POST /recipes should create a new recipe', async () => {
    const newRecipe = {
      title: 'Test New Recipe',
      description: 'A newly created recipe for testing',
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      difficulty: 'easy',
      category: 'dinner',
      tags: ['test', 'new'],
      ingredients: [{ name: 'ingredient1', amount: '1', unit: 'cup', order: 1 }],
      instructions: ['step1', 'step2'],
    };

    const res = await request(app).post(`${API_BASE}/recipes`).send(newRecipe);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newRecipe.title);
    expect(res.body.ingredients.length).toBe(1);

    // Verify it's added to the in-memory store
    const allRecipesRes = await request(app).get(`${API_BASE}/recipes`);
    expect(allRecipesRes.body.some((r) => r.id === res.body.id)).toBeTruthy();
  });

  it('POST /recipes should return 400 if title is missing', async () => {
    const newRecipe = {
      description: 'Missing title recipe',
    };
    const res = await request(app).post(`${API_BASE}/recipes`).send(newRecipe);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Title is required');
  });

  it('PUT /recipes/:id should update an existing recipe', async () => {
    // Create a recipe to update
    const createRes = await request(app)
      .post(`${API_BASE}/recipes`)
      .send({ title: 'Original Title', prepTime: 5 });
    const recipeToUpdateId = createRes.body.id;

    const updatedData = {
      title: 'Updated Test Recipe',
      cookTime: 30,
      ingredients: [{ name: 'updated ingredient', amount: '2', unit: 'oz', order: 1 }],
    };

    const res = await request(app).put(`${API_BASE}/recipes/${recipeToUpdateId}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', recipeToUpdateId);
    expect(res.body.title).toBe(updatedData.title);
    expect(res.body.cookTime).toBe(updatedData.cookTime);
    expect(res.body.ingredients.length).toBe(1);
    expect(res.body.ingredients[0].name).toBe('updated ingredient');

    // Verify update in the in-memory store
    const getRes = await request(app).get(`${API_BASE}/recipes/${recipeToUpdateId}`);
    expect(getRes.body.title).toBe(updatedData.title);
  });

  it('PUT /recipes/:id should return 404 for a non-existent recipe', async () => {
    const res = await request(app)
      .put(`${API_BASE}/recipes/${uuidv4()}`)
      .send({ title: 'Non Existent' });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Recipe not found');
  });

  it('DELETE /recipes/:id should delete an existing recipe', async () => {
    // Create a recipe to delete
    const createRes = await request(app)
      .post(`${API_BASE}/recipes`)
      .send({ title: 'Recipe to Delete' });
    const recipeToDeleteId = createRes.body.id;

    const res = await request(app).delete(`${API_BASE}/recipes/${recipeToDeleteId}`);
    expect(res.statusCode).toEqual(204);

    // Verify it's deleted from the in-memory store
    const getRes = await request(app).get(`${API_BASE}/recipes/${recipeToDeleteId}`);
    expect(getRes.statusCode).toEqual(404);
  });

  it('DELETE /recipes/:id should return 404 for a non-existent recipe', async () => {
    const res = await request(app).delete(`${API_BASE}/recipes/${uuidv4()}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Recipe not found');
  });

  it('GET /recipes with query "q" should return filtered recipes by title', async () => {
    // Ensure unique titles for robust testing
    await request(app).post(`${API_BASE}/recipes`).send({ title: 'Unique Cake', prepTime: 10 });
    await request(app).post(`${API_BASE}/recipes`).send({ title: 'Unique Pie', prepTime: 15 });

    const res = await request(app).get(`${API_BASE}/recipes?q=cake`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body.every((r) => r.title.toLowerCase().includes('cake'))).toBeTruthy();
  });

  it('GET /recipes with query "q" should return filtered recipes by ingredient', async () => {
    await request(app)
      .post(`${API_BASE}/recipes`)
      .send({
        title: 'Pasta with Pesto',
        ingredients: [{ name: 'Pesto', amount: '1', unit: 'cup', order: 1 }],
      });
    await request(app)
      .post(`${API_BASE}/recipes`)
      .send({
        title: 'Chicken Alfredo',
        ingredients: [{ name: 'Chicken', amount: '1', unit: 'lb', order: 1 }],
      });

    const res = await request(app).get(`${API_BASE}/recipes?q=pesto`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(
      res.body.every((r) => r.ingredients.some((ing) => ing.name.toLowerCase().includes('pesto')))
    ).toBeTruthy();
  });
});
