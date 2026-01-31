import React, { useEffect, useState, useCallback } from 'react';
import { getAllRecipes } from '../services/recipeApi';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRecipes(searchTerm);
      setRecipes(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (error)
    return <div className="text-center text-red-500 text-lg mt-8">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Our Delicious Recipes
      </h2>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <div className="text-center text-lg mt-8">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center text-lg mt-8">No recipes found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
