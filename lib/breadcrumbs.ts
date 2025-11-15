/**
 * Breadcrumb configuration and utilities
 * This file provides easy-to-use breadcrumb generation for the Teacher dashboard
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Route label mapping for breadcrumbs
 * Add new routes here to automatically generate breadcrumbs
 */
export const routeLabels: Record<string, string> = {
  // Base routes
  teachers: "Teacher",
  teacher: "Teacher",
  dashboard: "Overview",
  classes: "Classes",
  gradebook: "Gradebook",
  subjects: "Subjects",
  questions: "Question Bank",
  exams: "AI Exams",
  activities: "Activities",
  settings: "Settings",
  help: "Help",
  profile: "Profile",
  billing: "Billing",
  notifications: "Notifications",
};

/**
 * Generate breadcrumbs from a pathname
 * @param pathname - The current pathname (e.g., "/teacher/dashboard")
 * @param customLabels - Optional custom labels to override default labels
 * @returns Array of breadcrumb items
 *
 * @example
 * generateBreadcrumbs("/teacher/dashboard")
 * // Returns: [{ label: "Teacher", href: "/teacher" }, { label: "Overview", href: "/teacher/dashboard" }]
 *
 * @example
 * generateBreadcrumbs("/teacher/classes/123", { "123": "Class A" })
 * // Returns: [{ label: "Teacher", href: "/teacher" }, { label: "Classes", href: "/teacher/classes" }, { label: "Class A", href: "/teacher/classes/123" }]
 */
export function generateBreadcrumbs(
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] {
  // Remove leading/trailing slashes and split
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Use custom label if provided, otherwise use routeLabels, or capitalize segment
    const label =
      customLabels?.[segment] ||
      routeLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Get breadcrumb label for a specific route segment
 * Useful for getting labels in components
 */
export function getBreadcrumbLabel(segment: string): string {
  return (
    routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}
