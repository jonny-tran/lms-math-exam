import { ChartAreaInteractive } from "@/components/teachers/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/teachers/dashboard/section-cards";
import { SiteHeader } from "@/components/teachers/dashboard/site-header";
import {
  ActionItems,
  QuickAccessClasses,
} from "@/components/teachers/dashboard/dashboard-widgets";

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* 1. Stat Cards (Already customized) */}
            <SectionCards />

            <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:gap-6 lg:px-6">
              {/* 2. Main Chart (Already customized) - Spans 2 columns */}
              <div className="lg:col-span-2">
                <ChartAreaInteractive />
              </div>

              {/* 3. Action Items (New) - Spans 1 column */}
              <div className="lg:col-span-1">
                <ActionItems />
              </div>
            </div>

            {/* 4. Quick Access (New) */}
            <div className="px-4 lg:px-6">
              <QuickAccessClasses />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
