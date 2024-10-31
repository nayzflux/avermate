import { db } from "@/db";
import { grades, type InsertGrade } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function createGrade(grade: InsertGrade) {
  const insertedGrade = await db.insert(grades).values(grade).returning().get();
  return insertedGrade;
}

export async function getAllUserGrades(userId: string) {
  const userGrades = await db.query.grades.findMany({
    where: eq(grades.userId, userId),
    orderBy: desc(grades.createdAt),
  });
  
  return userGrades;
}
