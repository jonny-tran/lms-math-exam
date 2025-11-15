"use client";

import * as React from "react";

import { IconSend } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

export function ChatInterface() {
  // Mock chat messages
  const messages = [
    {
      role: "assistant",
      content: "Hello! How can I help you today? You can ask me to generate exam questions based on the context you provided.",
    },
    {
      role: "user",
      content: "Please generate 3 multiple-choice questions about 'Derivatives' from the 'Mathematics Syllabus' (Easy difficulty).",
    },
    {
      role: "assistant",
      content: "Here are 3 easy multiple-choice questions about Derivatives:\n\n1. What is the derivative of f(x) = 5?\n   a) 5\n   b) 0\n   c) 1\n   d) x\n\n2. ...\n3. ...",
    },
  ];

  return (
    <Card className="flex h-full flex-col border-0 shadow-none rounded-none">
      <CardHeader className="border-b">
        <h2 className="text-lg font-semibold">AI Chat Playground</h2>
      </CardHeader>

      {/* Chat message history */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full max-w-[80%] flex-col gap-2 rounded-lg p-3 text-sm",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-muted"
                )}
              >
                <span className="font-bold capitalize">{msg.role}</span>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Chat input form */}
      <CardFooter className="border-t p-4">
        <form className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Type your message here..."
            className="min-h-10 max-h-24 flex-1"
          />
          <Button type="submit" size="icon">
            <IconSend className="size-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

