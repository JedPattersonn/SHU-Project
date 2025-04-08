import { Metadata } from "next";
import { PasswordUpdateForm } from "@/components/settings/password-update-form";

export const metadata: Metadata = {
  title: "Settings | Energy Dashboard",
};

export default function SettingsPage() {
  return (
    <div className="container max-w-2xl py-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="mb-4 text-sm font-medium">Password</h4>
            <PasswordUpdateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
