import { user as UserSchema } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { TestTable } from "@/components/users/table"
export default async function UsersPage() {

const users = await db.select().from(UserSchema)



    return (
        <TestTable users={users} />
    )
}


