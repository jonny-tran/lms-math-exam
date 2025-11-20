"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconSparkles, IconDownload, IconCopy } from "@tabler/icons-react";
import { useQuiz } from "@/hooks/use-quiz";
import { useTeacherIdentity } from "@/hooks/use-teacher-identity";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const quizFormSchema = z.object({
  topic: z.string().optional().or(z.literal("")),
  grade: z.number().int().min(1).max(12).optional(),
  difficulty: z.string().optional().or(z.literal("")),
  count: z.number().int().min(1).max(50),
  type: z.string(),
  config_id: z.number().int().optional(),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export function QuizGenerator() {
  const { teacherId } = useTeacherIdentity();
  const { questions, loading, error, generateQuiz, clearQuestions } = useQuiz();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      topic: "",
      grade: undefined,
      difficulty: "",
      count: 5,
      type: "multiple_choice",
      config_id: undefined,
    },
  });

  const handleSubmit = async (values: QuizFormValues) => {
    if (!teacherId) {
      toast.error("Teacher ID is required");
      return;
    }

    try {
      await generateQuiz({
        topic: values.topic || undefined,
        grade: values.grade,
        difficulty: values.difficulty || undefined,
        count: values.count,
        type: values.type || "multiple_choice",
        teacher_id: teacherId,
        config_id: values.config_id,
      });
    } catch {
      // Error is handled by the hook
    }
  };

  const handleCopyQuestion = (index: number, questionText: string) => {
    void navigator.clipboard.writeText(questionText);
    setCopiedIndex(index);
    toast.success("Question copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadAll = () => {
    const content = questions
      .map((q, index) => {
        const choices = q.choices
          .map((choice, i) => `${String.fromCharCode(65 + i)}. ${choice}`)
          .join("\n");
        const correctAnswer = String.fromCharCode(65 + q.answer_index);
        return `${index + 1}. ${
          q.question
        }\n${choices}\nCorrect Answer: ${correctAnswer}\n${
          q.explanation ? `Explanation: ${q.explanation}` : ""
        }\n`;
      })
      .join("\n---\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-questions-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Quiz questions downloaded");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="size-5" />
            Generate Quiz Questions
          </CardTitle>
          <CardDescription>
            Use AI to generate quiz questions based on your specifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Derivatives, Algebra"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          placeholder="e.g., 10, 11, 12"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value, 10)
                                : undefined
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value, 10)
                                : 5
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <IconSparkles className="mr-2 size-4" />
                      Generate Quiz
                    </>
                  )}
                </Button>
                {questions.length > 0 && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDownloadAll}
                    >
                      <IconDownload className="mr-2 size-4" />
                      Download All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearQuestions}
                    >
                      Clear
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Generated Questions ({questions.length})
            </h3>
          </div>
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">
                    Question {index + 1}
                  </CardTitle>
                  <div className="flex gap-2">
                    {question.topic && (
                      <Badge variant="secondary">{question.topic}</Badge>
                    )}
                    {question.difficulty && (
                      <Badge
                        variant={
                          question.difficulty === "Easy"
                            ? "default"
                            : question.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{question.question}</p>
                <div className="space-y-2">
                  {question.choices.map((choice, choiceIndex) => (
                    <div
                      key={choiceIndex}
                      className={cn(
                        "rounded-lg border p-3",
                        choiceIndex === question.answer_index
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {String.fromCharCode(65 + choiceIndex)}.
                        </span>
                        <span>{choice}</span>
                        {choiceIndex === question.answer_index && (
                          <Badge className="ml-auto">Correct</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-muted-foreground mb-1 text-sm font-medium">
                        Explanation:
                      </p>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  </>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopyQuestion(
                        index,
                        `${question.question}\n${question.choices
                          .map((c, i) => `${String.fromCharCode(65 + i)}. ${c}`)
                          .join("\n")}\nCorrect: ${String.fromCharCode(
                          65 + question.answer_index
                        )}\n${
                          question.explanation
                            ? `Explanation: ${question.explanation}`
                            : ""
                        }`
                      )
                    }
                  >
                    {copiedIndex === index ? (
                      "Copied!"
                    ) : (
                      <>
                        <IconCopy className="mr-2 size-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
