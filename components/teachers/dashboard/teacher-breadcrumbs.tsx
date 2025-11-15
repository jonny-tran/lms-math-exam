"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  generateBreadcrumbs,
  type BreadcrumbItem as BreadcrumbItemType,
} from "@/lib/breadcrumbs";

interface TeacherBreadcrumbsProps {
  /**
   * Custom breadcrumb items to override auto-generated ones
   * If provided, this will be used instead of auto-generation
   */
  items?: BreadcrumbItemType[];
  /**
   * Custom labels for specific route segments
   * Useful for dynamic routes (e.g., class names, exam titles)
   */
  customLabels?: Record<string, string>;
  /**
   * Whether to show the home/teacher root breadcrumb
   * @default true
   */
  showRoot?: boolean;
}

/**
 * TeacherBreadcrumbs Component
 *
 * Automatically generates breadcrumbs based on the current route.
 * Easy to use and customize for the Teacher dashboard.
 *
 * @example
 * // Auto-generate from pathname
 * <TeacherBreadcrumbs />
 *
 * @example
 * // With custom labels for dynamic routes
 * <TeacherBreadcrumbs customLabels={{ "123": "Class A" }} />
 *
 * @example
 * // With completely custom items
 * <TeacherBreadcrumbs items={[
 *   { label: "Teacher", href: "/teacher" },
 *   { label: "Custom Page", href: "/teacher/custom" }
 * ]} />
 */
export function TeacherBreadcrumbs({
  items,
  customLabels,
  showRoot = true,
}: TeacherBreadcrumbsProps) {
  const pathname = usePathname();

  // Use provided items or generate from pathname
  let breadcrumbItems: BreadcrumbItemType[] = items || [];

  if (!items) {
    breadcrumbItems = generateBreadcrumbs(pathname, customLabels);

    // Remove root if showRoot is false
    if (!showRoot && breadcrumbItems.length > 0) {
      breadcrumbItems = breadcrumbItems.slice(1);
    }
  }

  // Don't render if no breadcrumbs
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <div key={item.href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
