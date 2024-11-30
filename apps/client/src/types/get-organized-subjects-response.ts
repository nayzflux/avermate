import { Period } from "./period";
import { Subject } from "./subject";

export type GetOrganizedSubjectsResponse = {
  periods: {
    period: Period;
    subjects: Subject[];
  }[];
};
