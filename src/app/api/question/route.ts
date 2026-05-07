import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const { amount, topic } = await request.json();

    const result = await generateObject({
      model: openai("gpt-4.1-nano"),
      schema: z.object({
        questions: z
          .array(
            z.object({
              question: z.string().describe("Enunciado da questão."),
              alternatives: z
                .array(
                  z.object({
                    description: z
                      .string()
                      .describe("Enunciado da alternativa."),
                    isCorrect: z
                      .boolean()
                      .describe("Se a alternativa é correta ou não."),
                  }),
                )
                .describe("Array de alternativas."),
            }),
          )
          .describe("Array de questões com alternativas."),
      }),
      system:
        "Você é um gerador de questões com alternativas de múltipla escolha, que gera questões com base no que o usuários solicita",
      prompt: `Gere ${amount} questões sobre ${topic}`,
    });

    return NextResponse.json({
      message: result.object.questions,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao gerar questões" },
      { status: 500 },
    );
  }
}
