import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../services/recipeApi';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="text-center text-lg mt-8">Loading recipe...</div>;
  if (error)
    return <div className="text-center text-red-500 text-lg mt-8">Error: {error.message}</div>;
  if (!recipe) return <div className="text-center text-lg mt-8">Recipe not found.</div>;

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{recipe.title}</h1>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Details</h2>
          <ul className="text-gray-700 space-y-2">
            <li>
              <strong>Prep Time:</strong> {recipe.prepTime} minutes
            </li>
            <li>
              <strong>Cook Time:</strong> {recipe.cookTime} minutes
            </li>
            <li>
              <strong>Servings:</strong> {recipe.servings}
            </li>
            <li>
              <strong>Difficulty:</strong> <span className="capitalize">{recipe.difficulty}</span>
            </li>
            <li>
              <strong>Category:</strong> <span className="capitalize">{recipe.category}</span>
            </li>
            {recipe.rating && (
              <li>
                <strong>Rating:</strong>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < recipe.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.695h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.695l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </li>
            )}
            {recipe.tags && recipe.tags.length > 0 && (
              <li>
                <strong>Tags:</strong>
                <div className="flex flex-wrap mt-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={ingredient.id || index}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Instructions</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      {recipe.notes && (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Notes</h2>
          <p className="text-gray-700 italic">{recipe.notes}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
