import { PartialSubject } from "./subject";

export type Grade = {
<<<<<<< HEAD
    name: string;
    outOf: number;
    value: number;
    coefficient: number;
    passedAt: string;
    subjectId: string;
    id: string;
    createdAt: string;
    userId: string;
    subject: PartialSubject;
}
=======
  name: string;
  outOf: number;
  value: number;
  coefficient: number;
  passedAt: string;
  subjectId: string;
  id: string;
  createdAt: string;
  userId: string;
  subject: PartialSubject;
};
>>>>>>> main

export type PartialGrade = Omit<Grade, "subject">;
