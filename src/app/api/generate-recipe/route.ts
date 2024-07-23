import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const { ingredients, profile } = await req.json(); // Extract ingredients and profile from the request

  console.log("Debugging ingredients: ", ingredients);
  console.log("Debugging profile: ", profile);

  const allergies = Array.isArray(profile.allergies)
    ? profile.allergies.join(", ")
    : profile.allergies || "None";
  const disliked_food = Array.isArray(profile.disliked_food)
    ? profile.disliked_food.join(", ")
    : profile.disliked_food || "None";
  const cuisine_preference = Array.isArray(profile.cuisine_preference)
    ? profile.cuisine_preference.join(", ")
    : profile.cuisine_preference || "None";

  console.log("Debugging allergies: ", allergies);
  try {
    const prompt = `
      You are a professional cook. I have the following ingredients: ${ingredients.join(
        ", "
      )}.
      Can you suggest *four* different recipes using only these ingredients and specify any additional ingredients separately?
      - For each recipe, please clearly separate the ingredients I provided from any extra ingredients needed.
      - Please provide the exact measurements for each ingredient. Don't mention the measurements in the instructions section.
      - Also consider the following user characteristics:
        - User allergies: ${allergies}
        - User dislikes: ${disliked_food}
        - User cuisine preference: ${cuisine_preference}
      - Maximum number of steps for each recipe is *six*.
      - When giving the steps, please be not too *extensive*. Just provide the necessary information. 
      - In the steps you dont need to mention any of the user characteristics.
      - When generating recipes if the user has a cuisine preference, please make sure that at least one of the recipes is of that cuisine. But not all recipes should be of the same cuisine. 
      - when providing the country of origin of the recipe be as more specific and accurate as possible and do not use abbreviations.
      - Please be very careful with the JSON format. Don't add any additional information; follow the example (just provide the JSON format).
      - Provide each recipe in a JSON format as follows:
      [
        {
          "recipe_name": "Recipe 1",
          "ingredients": ["ingredient1 - measurement", "ingredient2 - measurement"],
          "extra_ingredients": ["extra_ingredient1 - measurement", "extra_ingredient2 - measurement"],
          "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
          "country_of_origin": "Country Name"
        },
        {
          "recipe_name": "Recipe 2",
          "ingredients": ["ingredient1 - measurement", "ingredient2 - measurement"],
          "extra_ingredients": ["extra_ingredient1 - measurement", "extra_ingredient2 - measurement"],
          "instructions": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
          "country_of_origin": "Country Name"
        },
        ....
      ]
      - Ensure that only the ingredients I provided are listed under "ingredients".
      - Please only provide the text in the specified format, without additional explanations.
    `;

    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 2000,
    });

    const data = await response.json(); // Parse the JSON response
    // const recipe = data.choices[0].text.trim(); // Extract the recipe text

    console.log("Generated recipe:", data.choices[0].text);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
