"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import GeneratedRecipes from "./GeneratedRecipes";
import { Button } from "./ui/button";
import { HashLoader, PacmanLoader } from "react-spinners";
import { ChevronRightIcon } from "lucide-react";

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
        <div className="flex items-center rounded-full border-2 border-gray-500 p-1 mt-5">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder=" Search Ingredients..."
            className="bg-transparent outline-none border-none"
          />
          <Search />
        </div>
        {isLoading && <p>Loading...</p>}
        <ul>
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="cursor-pointer bg-white border-2 border-black rounded p-2 hover:bg-gray-300 mt-2"
              onClick={() => handleAddIngredient(result)}
            >
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute top-80 bottom-5 flex flex-col">
        <p className="text-2xl font-bold">Ingredients List:</p>
        <div className="flex flex-col flex-1 border-2 w-full border-gray-300 rounded-lg shadow-xl overflow-auto">
          <ul>
            {ingredientsList.map((item, index) => (
              <p className="flex items-center m-2">
                <ChevronRightIcon />
                {item}
              </p>
            ))}
          </ul>
          {ingredientsList.length > 0 ? (
            <div className="fixed bottom-5 m-2">
              <div className="">
                <Button onClick={() => setIngredientsList([])}>
                  Clear List
                </Button>
              </div>
              <div className="mt-2">
                <Button onClick={generateRecipe}>Generate Recipe</Button>
              </div>
            </div>
          ) : (
            <p className="text-center mt-40">Your list is empty</p>
          )}
        </div>
      </div>
      <div className="flex flex-col min-h-screen w-full px-5 py-5">
        <div className="flex flex-col flex-1 border-2 w-full border-gray-300 rounded-lg shadow-xl">
          <h2 className="text-center text-4xl font-bold">Generated Recipes:</h2>
          {isLoadingRecipe ? (
            <div className="flex items-center justify-center flex-1">
              <PacmanLoader size={90} />
            </div>
          ) : recipe ? (
            <GeneratedRecipes recipe={recipe} />
          ) : (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-3xl font-bold">No Recipes Generated Yet</p>
              <img
                src="https://github.com/StevenJSCF/Images/blob/main/Others/sad-emoji.png?raw=true"
                alt="sad-face image"
                className="w-40 h-40"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientsInput;
