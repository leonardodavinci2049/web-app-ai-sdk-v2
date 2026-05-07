import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import { NextResponse } from "next/server";

export async function POST(_request: Request) {
  const result = await generateText({
    model: openai("gpt-4.1-nano"),
    system: "Você é um assistente de ia e responde de forma humoristica",
    prompt: "Quanto que é 2+2?",
  });

  return NextResponse.json({ text: result.text });
}
