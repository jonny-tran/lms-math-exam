"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to student dashboard as the default student page
    router.replace("/student/dashboard");
  }, [router]);

  return null;
}
