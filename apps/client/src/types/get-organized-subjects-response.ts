import { Period } from "./period";
import { Subject } from "./subject";
import { Grade } from "./grade";

export type GetOrganizedSubjectsResponse = {
  periods: {
    period: Period;
    subjects: {
      subject: Subject;
        grades: Grade[];
    }[];
  }[];
};
