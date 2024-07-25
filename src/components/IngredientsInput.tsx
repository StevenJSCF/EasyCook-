"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import GeneratedRecipes from "./GeneratedRecipes";
import { Button } from "./ui/button";
import { HashLoader, PacmanLoader } from "react-spinners";
import { ChevronRightIcon } from "lucide-react";
import { UserProfileParams } from "@/lib/database/models/profile-model";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

type Props = {};

const IngredientsInput = (props: Props) => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null); // State to store the generated recipe

  const profile: UserProfileParams = {
    userId: "",
    allergies: "",
    disliked_food: "",
    cuisine_preference: "",
  };

  const { userId } = useAuth();
  const isAuth = !!userId;

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

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/get-profile");

      profile.userId = response.data.userId;
      profile.allergies = response.data.allergies;
      profile.disliked_food = response.data.disliked_food;
      profile.cuisine_preference = response.data.cuisine_preference;
      return response.data; // Return profile data from the API
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(fetchIngredients, 300);
    return () => clearTimeout(debounceFetch);
  }, [ingredient]);

  const generateRecipe = async () => {
    if (!isAuth) {
      toast.error("Please login to generate a recipe");
    } else {
      setIsLoadingRecipe(true);

      try {
        const profileData = await fetchProfile(); // Fetch profile data
        if (!profileData) {
          throw new Error("Failed to fetch profile");
        }

        // console.log("profileData: ", profileData);
        const response = await axios.post("/api/generate-recipe", {
          ingredients: ingredientsList,
          profile: profile, // Use the fetched profile data
        });

        const ai_text_response = response.data.data.choices[0].text;
        setIsLoadingRecipe(false);

        setRecipe(ai_text_response);
      } catch (error: any) {
        console.error(
          "Error generating recipe:",
          error.response?.data || error.message
        );
      }
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
              <p key={index} className="flex items-center m-2">
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
          {isLoadingRecipe ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <h2 className="text-center text-4xl font-bold mb-4">
                Generating recipes please wait
              </h2>
              <div className="flex items-center justify-center flex-1">
                <PacmanLoader size={90} />
              </div>
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
