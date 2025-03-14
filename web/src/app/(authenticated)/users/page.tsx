import { checkUserAccess } from "@/lib/auth";
import { Metadata } from "next";
import { db } from "@/lib/db";
import { user as UserSchema } from "@/lib/db/schema";
import { ne } from "drizzle-orm";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
    title: "Users | Admin View"
}

export default async function UsersAdminPage() {
    await checkUserAccess("admin");

    const users = await db.select().from(UserSchema).where(ne(UserSchema.role, "admin"));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Users</h1>
            </div>

            <Table>
                <TableCaption>A list of all non-admin users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email Verified</TableHead>
                        <TableHead>2FA Enabled</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role || "user"}</TableCell>
                            <TableCell>{user.emailVerified ? "Yes" : "No"}</TableCell>
                            <TableCell>{user.twoFactorEnabled ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                {user.banned ? (
                                    <span className="text-red-500">Banned</span>
                                ) : (
                                    <span className="text-green-500">Active</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}