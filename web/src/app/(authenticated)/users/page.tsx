import { user, user as UserSchema } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { TestTable } from "@/components/users/table"
import { NewUserDialog } from "@/components/users/new-user-dialog"
export default async function UsersPage() {

const users = await db.select({
    id: UserSchema.id,
    name: UserSchema.name,
    email: UserSchema.email,
    role: UserSchema.role
}).from(UserSchema)

    return (
        <div>
            <NewUserDialog />
            <TestTable users={users} />
        </div>
    )
}


