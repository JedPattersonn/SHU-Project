import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FirstLoginBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-blue-800">
            Password Update Required
          </h3>
          <p className="text-blue-600 text-sm mt-1">
            For security reasons, please update your password in the settings
            page. Since you didn&apos;t create this password yourself, it may
            not be fully secure.
          </p>
        </div>
        <Link href="/settings">
          <Button variant="outline" className="bg-white hover:bg-blue-50">
            Update Password
          </Button>
        </Link>
      </div>
    </div>
  );
}
