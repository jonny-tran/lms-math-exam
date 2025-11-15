"use client";

import * as React from "react";
import {
  IconAlertTriangle,
  IconClock,
  IconSchool,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Widget 1: Action Items
export function ActionItems() {
  const items = [
    {
      icon: <IconAlertTriangle className="size-5 text-yellow-500" />,
      title: "5 new submissions in Class 10A",
      description: "Midterm Exam",
      href: "/teachers/gradebook?class=CLS-001",
    },
    {
      icon: <IconUserPlus className="size-5 text-blue-500" />,
      title: "Student 'Tran Van B' enrolled",
      description: "Class 10B",
      href: "/teachers/classes/CLS-002/students",
    },
    {
      icon: <IconClock className="size-5 text-red-500" />,
      title: "Final Exam (Class 10A) is due in 3 days",
      description: "20 students have not submitted",
      href: "/teachers/exams/EXM-001",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Items</CardTitle>
        <CardDescription>Your prioritized to-do list.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                {item.icon}
              </div>
              <div className="flex-1">
                <Link href={item.href} className="font-medium hover:underline">
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            {index < items.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

// Widget 2: Quick Access Classes
export function QuickAccessClasses() {
  const classes = [
    { id: "CLS-001", name: "Class 10A" },
    { id: "CLS-002", name: "Class 10B" },
    { id: "CLS-003", name: "Class 11C" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>Jump directly into your classes.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 @[250px]/card:grid-cols-2 @[400px]/card:grid-cols-3">
        {classes.map((cls) => (
          <Button
            key={cls.id}
            variant="outline"
            asChild
            className="flex h-16 flex-col items-start justify-center gap-1"
          >
            <Link href={`/teachers/classes/${cls.id}`}>
              <span className="font-semibold">{cls.name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                View details
              </span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

