import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TeacherBreadcrumbs } from "./teacher-breadcrumbs";

interface SiteHeaderProps {
  /**
   * Custom breadcrumb items to override auto-generated ones
   */
  breadcrumbItems?: Array<{ label: string; href: string }>;
  /**
   * Custom labels for specific route segments
   */
  breadcrumbCustomLabels?: Record<string, string>;
  /**
   * Whether to show the root breadcrumb
   * @default true
   */
  showBreadcrumbRoot?: boolean;
}

export function SiteHeader(
  {
    breadcrumbItems,
    breadcrumbCustomLabels,
    showBreadcrumbRoot = true,
  }: SiteHeaderProps = {} as SiteHeaderProps
) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <TeacherBreadcrumbs
          items={breadcrumbItems}
          customLabels={breadcrumbCustomLabels}
          showRoot={showBreadcrumbRoot}
        />
      </div>
    </header>
  );
}
