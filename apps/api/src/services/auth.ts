import { db } from "@/db";
import { users, type InsertUser } from "@/db/schema";

/**
 * Insert user in database
 */
export async function createUser({
  id,
  email,
  firstName,
  lastName,
  password,
  createdAt,
}: InsertUser) {
  const user = await db
    .insert(users)
    .values({
      email,
      firstName,
      lastName,
      id,
      password,
      createdAt,
    })
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      createdAt: users.createdAt,
    })
    .get();

  return user;
}
