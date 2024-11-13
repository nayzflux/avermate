import { PartialSubject } from "./subject";

export type Grade = {
    name: string;
    outOf: number;
    value: number;
    coefficient: number;
    passedAt: Date;
    subjectId: string;
    id: string;
    createdAt: Date;
    userId: string;
    subject: PartialSubject;
}

export type PartialGrade = Omit<Grade, "subject">;