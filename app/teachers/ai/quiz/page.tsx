import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { QuizGenerator } from "@/components/teachers/ai/quiz-generator";

export default function QuizGeneratorPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            AI Quiz Generator
          </h1>
          <p className="text-muted-foreground">
            Tạo bài kiểm tra tự động bằng AI.
          </p>
        </div>
        <QuizGenerator />
      </main>
    </>
  );
}

