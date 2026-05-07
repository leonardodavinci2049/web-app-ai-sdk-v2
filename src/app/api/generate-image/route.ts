import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return Response.json({ error: "Prompt is required." }, { status: 400 });
    }

    const { image } = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt: prompt.trim(),
      size: "1024x1024",
      providerOptions: {
        openai: { style: "vivid", quality: "hd" },
      },
    });

    return Response.json(image.base64);
  } catch (error) {
    console.error("Error generating image:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
