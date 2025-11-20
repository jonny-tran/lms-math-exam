import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import { AiCallLogsViewer } from "@/components/teachers/ai/ai-call-logs-viewer";

export default function AiCallLogsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">
            AI Call Logs
          </h1>
          <p className="text-muted-foreground">
            Xem lịch sử các cuộc gọi AI và phân tích hiệu suất.
          </p>
        </div>
        <AiCallLogsViewer />
      </main>
    </>
  );
}

