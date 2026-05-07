// app/api/chat/route.ts

import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: openai("gpt-5-nano"),
      messages: [
        {
          role: "system", // Example system message to set the tone of the conversation
          content:
            "You are a helpful coding assistant. Keep responses under 3 sentences and focus on practical examples.",
        },
        {
          role: "user", // Example system message to trigger reasoning in the UI
          content: "Explain how to use the useChat hook in the AI SDK.",
        },
        {
          role: "assistant", // Example system message to trigger reasoning in the UI
          content:
            "reasoning: To explain how to use the useChat hook, I will first describe its purpose, then provide a basic example of its usage in a React component.",
        },

        ...modelMessages,
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
