export type Subject = {
  name: string;
  coefficient: number;
  parentId: string | null;
  id: string;
  createdAt: Date;
  userId: string;
  grades: {
    name: string;
    coefficient: number;
    value: number;
    id: string;
    createdAt: Date;
    userId: string;
    outOf: number;
    passedAt: Date;
    subjectId: string;
  }[];
};
