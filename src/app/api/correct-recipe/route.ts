import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: NextRequest) {
  const { recipe } = await req.json(); // Extract ingredients and profile from the request

  console.log("Debugging recipe: ", recipe);

  try {
    const prompt = `
    Your task is to check this json recipe and correct it if there are any mistakes.
    - JSON recipe: ${recipe}
    - Just return the corrected JSON recipe.
    - Dont add aditional information.
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
