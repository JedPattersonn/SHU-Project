import { user as UserSchema } from "@/lib/db/schema"
import { db } from "@/lib/db"
export default async function UsersPage() {

const users = await db.select().from(UserSchema)

console.log(users)


    return (
        <p>Users</p>
    )
}


