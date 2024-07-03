"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import GeneratedRecipes from "./GeneratedRecipes";
import { Button } from "./ui/button";

type Props = {};

const IngredientsInput = (props: Props) => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null); // State to store the generated recipe

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredientsList.includes(ingredient)) {
      setIngredientsList([...ingredientsList, ingredient]);
      setSearchResults([]);
      setIngredient("");
    }
  };

  const fetchIngredients = async () => {
    if (ingredient.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.edamam.com/auto-complete`, {
        params: {
          q: ingredient,
          app_id: process.env.EDAMAM_APP_ID,
          app_key: process.env.EDAMAM_APP_KEY,
        },
      });
      setSearchResults(response.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(fetchIngredients, 300);
    return () => clearTimeout(debounceFetch);
  }, [ingredient]);

  const generateRecipe = async () => {
    setIsLoadingRecipe(true);
    try {
      const response = await axios.post("/api/generate-recipe", {
        ingredients: ingredientsList,
      });

      const ai_text_response = response.data.data.choices[0].text;
      // Logging the entire response to understand its structure
      console.log("API text Response:", ai_text_response);
      setIsLoadingRecipe(false);

      setRecipe(ai_text_response);
    } catch (error: any) {
      console.error(
        "Error generating recipe:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="relative flex">
      <div>
        <h2>Search Ingredients:</h2>
        <div className="flex items-center rounded-full border-2 border-gray-500 p-1 mt-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder=" Type to search..."
            className="bg-transparent outline-none border-none"
          />
          <Search />
        </div>
        {isLoading && <p>Loading...</p>}
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="cursor-pointer bg-black rounded p-2 hover:bg-gray-300 mt-2"
              onClick={() => handleAddIngredient(result)}
            >
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute top-80">
        <h2>Ingredients List:</h2>
        <ul>
          {ingredientsList.map((item, index) => (
            <li key={index}>- {item}</li>
          ))}
        </ul>
        {ingredientsList.length > 0 ? (
          <div>
            <div>
              <Button onClick={() => setIngredientsList([])}>Clear List</Button>
            </div>
            <div>
              <Button onClick={generateRecipe}>Generate Recipe</Button>
            </div>
          </div>
        ) : (
          <p>Your list is empty</p>
        )}
      </div>
      <div className="flex flex-col min-h-screen w-full px-10 pt-5">
        <div className="flex flex-col flex-1 border-2 w-full rounded-lg ">
          <h2 className="text-center">Generated Recipes:</h2>
          {isLoadingRecipe ? (
            <p>Loading recipe...</p>
          ) : recipe ? (
            <GeneratedRecipes recipe={recipe} />
          ) : (
            <p>No recipe generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsInput;
