import { SiteHeader } from "@/components/teachers/dashboard/site-header";

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4">
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="text-muted-foreground">
                  Manage your profile information and account settings
                </p>
              </div>
              <div className="rounded-lg border p-6">
                <p className="text-muted-foreground">
                  Profile content will be implemented here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

