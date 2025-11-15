import {
  IconUsers,
  IconSchool,
  IconFileCheck,
  IconBooks,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Total Students */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Students</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            150
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconUsers />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +5 new students this week
          </div>
          <div className="text-muted-foreground">
            Total students across all classes
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Active Classes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Classes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconSchool />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            1 new class added
          </div>
          <div className="text-muted-foreground">
            Total active classes you are teaching
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Submissions (Ungraded) */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Submissions (Ungraded)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconFileCheck />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            3 new submissions in 24h
          </div>
          <div className="text-muted-foreground">
            Total exam attempts needing review
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Content Created */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Content Created</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            89
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBooks />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            +3 new questions this week
          </div>
          <div className="text-muted-foreground">
            Total questions and activities
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
