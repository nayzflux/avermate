import { db } from "@/db";
import { subjects, users, type InsertSubject } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Create a new subject
 */
export async function createSubject(subject: InsertSubject) {
  const insertedSubject = await db
    .insert(subjects)
    .values(subject)
    .returning()
    .get();

  return insertedSubject;
}

/**
 * Get all user subjects
 */
export async function getAllUserSubjects(userId: string) {
  const subjects = await db.query.subjects.findMany({
    where: eq(users.id, userId),
  });

  return subjects;
}

/**
 * Delete a subject
 */
export async function deleteSubject(subjectId: string) {
  const deletedSubject = await db
    .delete(subjects)
    .where(eq(subjects.id, subjectId))
    .returning()
    .get();

  return deletedSubject;
}
