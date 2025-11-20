"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { IconSend, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useAiChats } from "@/hooks/use-ai-chats";
import { useTeacherIdentity } from "@/hooks/use-teacher-identity";
import { format } from "date-fns";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatInterface() {
  const { teacherId } = useTeacherIdentity();
  const { createChat, loading } = useAiChats(teacherId ?? undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! How can I help you today? You can ask me to generate exam questions based on the context you provided.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !teacherId) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      // Create chat session in backend
      await createChat({
        teacher_id: teacherId,
        message: userMessage.content,
        chat_summary: userMessage.content.substring(0, 100),
      });

      // Simulate AI response (in real implementation, this would come from API)
      // For now, we'll add a placeholder response
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content:
            "I received your message. In a full implementation, this would be the AI's response based on your configuration and context.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsSending(false);
      }, 1000);
    } catch {
      setIsSending(false);
      // Error is handled by the hook
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! How can I help you today? You can ask me to generate exam questions based on the context you provided.",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <Card className="flex h-full flex-col border-0 shadow-none rounded-none">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">AI Chat Playground</h2>
        {messages.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-muted-foreground"
          >
            <IconTrash className="mr-2 size-4" />
            Clear
          </Button>
        )}
      </CardHeader>

      {/* Chat message history */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
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
                <div className="flex items-center justify-between">
                  <span className="font-bold capitalize">{msg.role}</span>
                  {msg.timestamp && (
                    <span className="text-xs opacity-70">
                      {format(new Date(msg.timestamp), "HH:mm")}
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
            {isSending && (
              <div className="mr-auto flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                <Spinner className="size-4" />
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Chat input form */}
      <CardFooter className="border-t p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
        >
          <Textarea
            placeholder="Type your message here..."
            className="min-h-10 max-h-24 flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending || loading || !teacherId}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isSending || loading || !teacherId}
          >
            {isSending || loading ? (
              <Spinner className="size-4" />
            ) : (
              <IconSend className="size-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
