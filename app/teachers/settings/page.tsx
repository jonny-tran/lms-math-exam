import { SiteHeader } from "@/components/teachers/dashboard/site-header";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";

import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      {/* Use <main> tag for content spacing */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6">
        {/* Page Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and AI configuration.
          </p>
        </div>

        {/* Grid layout for the two settings cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Card 1: Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and bio.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Field: Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Teacher Name" />
              </div>
              {/* Field: Email (Disabled) */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="teacher@example.com"
                  disabled
                />
              </div>
              {/* Field: Bio */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about yourself..."
                  className="min-h-24"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          {/* Card 2: AI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Adjust the settings for the AI exam generator.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Field: AI Model */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select defaultValue="gpt-4o">
                  <SelectTrigger id="ai-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Field: Temperature */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm text-muted-foreground">0.5</span>
                </div>
                <Slider
                  id="temperature"
                  defaultValue={[0.5]}
                  max={1}
                  step={0.1}
                />
              </div>
              {/* Field: Max Tokens */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input id="max-tokens" type="number" defaultValue={2048} />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Configuration</Button>
            </CardFooter>
          </Card>

        </div>
      </main>
    </>
  );
}
