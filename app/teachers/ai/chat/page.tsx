import * as React from "react";

import { SiteHeader } from "@/components/teachers/dashboard/site-header";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ChatInterface } from "@/components/teachers/ai/chat-interface";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

export default function AiChatPage() {
  return (
    <>
      <SiteHeader />
      {/* This is the main layout for the chat page.
        It's a flex-1 column to fill the remaining height
        and contains the ResizablePanelGroup.
      */}
      <main className="flex flex-1 flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel: Context Selection */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex h-full flex-col p-4">
              <h2 className="text-lg font-semibold">Context Sources</h2>
              <p className="text-muted-foreground text-sm">
                Select materials to train the AI.
              </p>
              
              {/* Placeholder for Context Selection UI */}
              <div className="flex-1 overflow-auto pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="syllabus-1" />
                      <Label htmlFor="syllabus-1" className="font-normal">
                        Mathematics Syllabus
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="syllabus-2" />
                      <Label htmlFor="syllabus-2" className="font-normal">
                        Physics Syllabus
                      </Label>
                    </div>
                  </CardContent>
                </Card>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-base">Question Banks</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="qb-1" />
                      <Label htmlFor="qb-1" className="font-normal">
                        Algebra Questions
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel: Chat Interface */}
          <ResizablePanel defaultSize={70} minSize={30}>
            {/* The ChatInterface component will fill this panel */}
            <ChatInterface />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </>
  );
}

