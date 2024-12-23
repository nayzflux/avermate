import { Subject } from "@/types/subject";
import { Period } from "@/types/period";
import { startOfDay } from "date-fns";
import { Average } from "@/types/average";
import { Grade } from "@/types/grade";

export function average(
  subjectId: string | undefined,
  subjects: Subject[],
  customAverage?: Average
): number | null {
  if (customAverage) {
    return calculateCustomAverage(subjectId, subjects, customAverage);
  }

  if (!subjectId) {
    // General average without custom average
    const rootSubjects = subjects.filter((s) => s.parentId === null);
    return calculateAverageForSubjects(rootSubjects, subjects);
  }

  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  return calculateAverageForSubject(subject, subjects);
}

function calculateCustomAverage(
  subjectId: string | undefined,
  subjects: Subject[],
  customAverage: Average
): number | null {
  // Build customConfig from customAverage.subjects
  const customConfig = new Map<string, { customCoefficient: number | null; includeChildren: boolean }>();
  for (const s of customAverage.subjects) {
    customConfig.set(s.id, {
      customCoefficient: s.customCoefficient ?? null,
      includeChildren: s.includeChildren ?? true,
    });
  }

  // Filter subjects to only those included
  const includedSubjects = subjects.filter((subj) =>
    isSubjectIncludedInCustomAverage(subj, subjects, customConfig)
  );
  if (includedSubjects.length === 0) {
    return null;
  }

  // If no subjectId, average across all included subjects
  if (!subjectId) {
    return calculateAverageForSubjects(includedSubjects, includedSubjects, customConfig, true);
  }

  // If a specific subjectId is given, average that subject only if it is included
  const targetSubject = includedSubjects.find((s) => s.id === subjectId);
  if (!targetSubject) {
    return null;
  }

  return calculateAverageForSubject(targetSubject, includedSubjects, customConfig, true);
}


export function isSubjectIncludedInCustomAverage(
  subject: Subject,
  allSubjects: Subject[],
  customConfig: Map<string, { customCoefficient: number | null; includeChildren: boolean }>
): boolean {
  // 1) If explicitly included
  if (customConfig.has(subject.id)) {
    return true;
  }

  // 2) Check ancestors
  let current = subject;
  while (current.parentId) {
    if (customConfig.has(current.parentId)) {
      const parentCfg = customConfig.get(current.parentId);
      if (parentCfg && parentCfg.includeChildren) {
        return true;
      }
    }
    const parent = allSubjects.find((s) => s.id === current.parentId);
    if (!parent) break;
    current = parent;
  }

  return false;
}



function calculateAverageForSubject(
  subject: Subject,
  subjects: Subject[],
  customConfig?: Map<string, { customCoefficient: number | null; includeChildren: boolean }>,
  isCustom = false
): number | null {
  let totalWeightedPercentages = 0;
  let totalCoefficients = 0;

  // Calculate direct grades
  if (subject.grades && subject.grades.length > 0) {
    for (const grade of subject.grades) {
      const gradeValue = grade.value / 100;
      const outOf = grade.outOf / 100;
      const gradeCoefficient = (grade.coefficient ?? 100) / 100;
      if (outOf === 0) continue;

      const percentage = gradeValue / outOf;
      totalWeightedPercentages += percentage * gradeCoefficient;
      totalCoefficients += gradeCoefficient;
    }
  }

  // Get children subjects
  let descendants: Subject[];
  if (isCustom && customConfig) {
    // For custom averages, consider all included descendants (display or not) if allowed
    descendants = getAllIncludedDescendants(subject, subjects, customConfig);
    // We already have subject itself calculated above, so we remove it from descendants to avoid double counting
    descendants = descendants.filter((s) => s.id !== subject.id);
  } else {
    // Original logic for global average
    const allNonDisplaySubjects = getAllNonDisplaySubjects(subject, subjects);
    descendants = allNonDisplaySubjects.filter((s) => s.id !== subject.id);
  }

  for (const child of descendants) {
    const childAverage = calculateAverageForSubject(child, subjects, customConfig, isCustom);
    if (childAverage !== null) {
      const childPercentage = childAverage / 20;
      let childCoefficient = (child.coefficient ?? 100) / 100;

      if (customConfig && customConfig.has(child.id)) {
        const cc = customConfig.get(child.id)!;
        if (cc.customCoefficient !== null) {
          childCoefficient = cc.customCoefficient;
        }
      }

      totalWeightedPercentages += childPercentage * childCoefficient;
      totalCoefficients += childCoefficient;
    }
  }

  if (totalCoefficients === 0) return null;

  const averagePercentage = totalWeightedPercentages / totalCoefficients;
  return averagePercentage * 20;
}

function calculateAverageForSubjects(
  subjects: Subject[],
  allSubjects: Subject[],
  customConfig?: Map<string, { customCoefficient: number | null; includeChildren: boolean }>,
  isCustom = false
): number | null {
  let totalWeightedPercentages = 0;
  let totalCoefficients = 0;

  for (const subject of subjects) {
    let consideredSubjects: Subject[];
    if (isCustom && customConfig) {
      // In custom scenario, consider included descendants for each subject
      consideredSubjects = getAllIncludedDescendants(subject, allSubjects, customConfig);
    } else {
      consideredSubjects = getAllNonDisplaySubjects(subject, allSubjects);
    }

    // Ensure we don't double count the parent subject in this scenario
    // The parent subject is included in getAllNonDisplaySubjects if not display
    // or in custom scenario, all included descendants include the subject itself as well
    // but that's expected behavior since we want to average that subject's grades too.
    for (const nonDisplaySubject of consideredSubjects) {
      const subjectAverage = calculateAverageForSubject(nonDisplaySubject, allSubjects, customConfig, isCustom);
      if (subjectAverage !== null) {
        const subjectPercentage = subjectAverage / 20;
        let subjectCoefficient = (nonDisplaySubject.coefficient ?? 100) / 100;
        if (customConfig && customConfig.has(nonDisplaySubject.id)) {
          const cc = customConfig.get(nonDisplaySubject.id)!;
          if (cc.customCoefficient !== null) {
            subjectCoefficient = cc.customCoefficient;
          }
        }
        totalWeightedPercentages += subjectPercentage * subjectCoefficient;
        totalCoefficients += subjectCoefficient;
      }
    }
  }

  if (totalCoefficients === 0) return null;

  const averagePercentage = totalWeightedPercentages / totalCoefficients;
  return averagePercentage * 20;
}

function getAllNonDisplaySubjects(subject: Subject, subjects: Subject[]): Subject[] {
  const children = subjects.filter((s) => s.parentId === subject.id);
  let nonDisplayList: Subject[] = [];

  if (!subject.isDisplaySubject) {
    nonDisplayList.push(subject);
  }

  for (const child of children) {
    if (child.isDisplaySubject) {
      nonDisplayList = nonDisplayList.concat(getAllNonDisplaySubjects(child, subjects));
    } else {
      nonDisplayList.push(child);
    }
  }

  return nonDisplayList;
}

/**
 * For custom averages, we want to include any subject that is included directly or through a parent with includeChildren=true.
 * This function returns the given subject and all its descendants that are included.
 */
function getAllIncludedDescendants(
  subject: Subject,
  allSubjects: Subject[],
  customConfig: Map<string, { customCoefficient: number | null; includeChildren: boolean }>
): Subject[] {
  const included: Subject[] = [];

  // If current subject is included, add it
  if (isSubjectIncludedInCustomAverage(subject, allSubjects, customConfig)) {
    included.push(subject);
  }

  // Check children
  const children = allSubjects.filter((s) => s.parentId === subject.id);
  for (const child of children) {
    // If child is included (directly or through parent's `includeChildren`), gather it plus its descendants
    if (isSubjectIncludedInCustomAverage(child, allSubjects, customConfig)) {
      included.push(...getAllIncludedDescendants(child, allSubjects, customConfig));
    }
  }

  return included;
}


/**
 * Determines if a particular grade belongs to a custom average. 
 * We check if the grade's subject is included or has a parent included with `includeChildren`.
 * 
 * If the subject isn't included, returns false. Otherwise true.
 */
export function isGradeIncludedInCustomAverage(
  grade: Grade,
  allSubjects: Subject[],
  customAvg: Average
): boolean {
  // 1. Build the custom config map
  const configMap = new Map<string, { customCoefficient: number | null; includeChildren: boolean }>();
  for (const s of customAvg.subjects) {
    configMap.set(s.id, {
      customCoefficient: s.customCoefficient ?? null,
      includeChildren: s.includeChildren ?? true,
    });
  }

  // 2. The subject to which this grade belongs
  const subject = allSubjects.find((subj) => subj.id === grade.subjectId);
  if (!subject) {
    return false;
  }

  // 3. If subject is directly included, done
  if (configMap.has(subject.id)) {
    return true;
  }

  // 4. Otherwise, check if any ancestor is included with includeChildren = true
  let current = subject;
  while (current.parentId) {
    if (configMap.has(current.parentId)) {
      const parentCfg = configMap.get(current.parentId);
      if (parentCfg && parentCfg.includeChildren) {
        return true;
      }
    }
    current = allSubjects.find((s) => s.id === current.parentId) || current;
    if (!current) break;
  }

  return false;
}


export function averageOverTime(
  subjects: Subject[],
  subjectId: string | undefined,
  period: Period
): (number | null)[] {
  const { startAt, endAt } = findPeriodBounds(period, subjects);
  const normalizedStartDate = startOfDay(startAt);
  const normalizedEndDate = startOfDay(endAt);
  const isFullYear = period.id === "full-year";

  const dates = createDateRange(normalizedStartDate, normalizedEndDate, 1);

  // Get relevant grades for the specific subject and its children (if subjectId is provided)
  const relevantGrades = subjects
    .filter(
      (subject) =>
        !subjectId || // Include all subjects if no subjectId is provided
        subject.id === subjectId ||
        getChildren(subjects, subjectId).includes(subject.id)
    )
    .flatMap((subject) =>
      subject.grades.filter((grade) => isFullYear || grade.periodId === period.id)
    );

  // Extract grade dates only for the relevant subject or its children
  const gradeDates = relevantGrades.map((grade) => {
    const gradeDate = new Date(grade.passedAt);
    if (gradeDate < normalizedStartDate) return normalizedStartDate;
    if (gradeDate > normalizedEndDate) return normalizedEndDate;
    return gradeDate;
  });

  // Ensure unique dates for relevant grades
  const uniqueGradeDates = Array.from(
    new Set(gradeDates.map((date) => date.getTime()))
  ).map((time) => new Date(time));

  return dates.map((date, index) => {
    const isRelevantDate =
      uniqueGradeDates.some(
        (gradeDate) => gradeDate.getTime() === date.getTime()
      ) || index === dates.length - 1;

    if (isRelevantDate) {
      const subjectsWithAdjustedGrades = subjects.map((subject) => ({
        ...subject,
        grades: subject.grades
          .filter((grade) => isFullYear || grade.periodId === period.id)
          .map((grade) => {
            const gradeDate = new Date(grade.passedAt);
            let adjustedDate = gradeDate;

            if (gradeDate < normalizedStartDate) {
              adjustedDate = normalizedStartDate;
            } else if (gradeDate > normalizedEndDate) {
              adjustedDate = normalizedEndDate;
            }

            return {
              ...grade,
              passedAt: adjustedDate.toISOString(),
            };
          })
          .filter((grade) => new Date(grade.passedAt) <= date),
      }));

      return average(subjectId, subjectsWithAdjustedGrades);
    }

    return null;
  });
}




// Logic validated ✅
// Compute the average for each subject and return an array of objects with subject ID and its average
export function getSubjectAverages(
  subjects: Subject[]
): { id: string; average: number; isMainSubject: boolean }[] {
  return subjects
    .map((subject) => {
      const averageValue = calculateAverageForSubject(subject, subjects);
      return averageValue !== null
        ? {
            id: subject.id,
            average: averageValue,
            isMainSubject: subject.isMainSubject ?? false,
          }
        : null;
    })
    .filter(
      (
        entry
      ): entry is { id: string; average: number; isMainSubject: boolean } =>
        entry != null
    );
}

// Logic validated ✅
// Compare a subject's average with others
export function getSubjectAverageComparison(
  subjects: Subject[],
  subjectIdToCompare: string,
  isMainSubject?: boolean,
  subjectsId?: string[]
): { difference: number; percentageChange: number | null } | null {
  // Ensure both isMainSubject and subjectsId are not defined together
  if (isMainSubject && subjectsId && subjectsId.length > 0) {
    throw new Error("Cannot specify both isMainSubject and subjectsId");
  }

  const subjectAverage = average(subjectIdToCompare, subjects);

  if (subjectAverage === null) {
    return null;
  }

  let comparisonAverage: number | null = null;

  if (subjectsId && subjectsId.length > 0) {
    const averages = subjectsId
      .filter((id) => id !== subjectIdToCompare)
      .map((id) => average(id, subjects))
      .filter((avg): avg is number => avg !== null);

    if (averages.length === 0) {
      return null;
    }

    comparisonAverage =
      averages.reduce((acc, avg) => acc + avg, 0) / averages.length;
  } else if (isMainSubject) {
    const mainSubjects = subjects.filter(
      (s) => s.isMainSubject && s.id !== subjectIdToCompare
    );
    const averages = mainSubjects
      .map((s) => average(s.id, subjects))
      .filter((avg): avg is number => avg !== null);

    if (averages.length === 0) {
      return null;
    }

    comparisonAverage =
      averages.reduce((acc, avg) => acc + avg, 0) / averages.length;
  } else {
    // Compare with all subjects excluding subjectIdToCompare
    const otherSubjects = subjects.filter((s) => s.id !== subjectIdToCompare);
    const averages = otherSubjects
      .map((s) => average(s.id, subjects))
      .filter((avg): avg is number => avg !== null);

    if (averages.length === 0) {
      return null;
    }

    comparisonAverage =
      averages.reduce((acc, avg) => acc + avg, 0) / averages.length;
  }

  const difference = subjectAverage - comparisonAverage;

  let percentageChange: number | null = null;
  if (comparisonAverage !== 0) {
    percentageChange = (difference / comparisonAverage) * 100;
  }

  return { difference, percentageChange };
}

// Logic validated ✅
// Get the subject with the best average; if tied, pick the one with the highest coefficient
export function getBestSubject(
  subjects: Subject[],
  isMainSubject: boolean = false
): Subject | null {
  let subjectAverages = getSubjectAverages(subjects);

  if (isMainSubject) {
    subjectAverages = subjectAverages.filter(
      (subject) => subject.isMainSubject
    );
  }

  if (subjectAverages.length === 0) {
    return null;
  }

  const bestAverage = Math.max(
    ...subjectAverages.map((entry) => entry.average)
  );

  // Filter subjects with the best average
  const bestSubjects = subjects.filter((subject) =>
    subjectAverages.some(
      (entry) => entry.id === subject.id && entry.average === bestAverage
    )
  );

  if (bestSubjects.length === 0) {
    return null;
  }

  // Select the subject with the highest coefficient
  let bestSubject = bestSubjects[0];
  let maxCoefficient = bestSubject.coefficient ?? 100;

  for (const subject of bestSubjects) {
    const coeff = subject.coefficient ?? 100;
    if (coeff > maxCoefficient) {
      maxCoefficient = coeff;
      bestSubject = subject;
    }
  }

  return bestSubject;
}

// Logic validated ✅
// Get the subject with the worst average; if tied, pick the one with the highest coefficient
export function getWorstSubject(
  subjects: Subject[],
  isMainSubject: boolean = false
): Subject | null {
  let subjectAverages = getSubjectAverages(subjects);

  if (isMainSubject) {
    subjectAverages = subjectAverages.filter(
      (subject) => subject.isMainSubject
    );
  }

  if (subjectAverages.length === 0) {
    return null;
  }

  const worstAverage = Math.min(
    ...subjectAverages.map((entry) => entry.average)
  );

  // Filter subjects with the worst average
  const worstSubjects = subjects.filter((subject) =>
    subjectAverages.some(
      (entry) => entry.id === subject.id && entry.average === worstAverage
    )
  );

  if (worstSubjects.length === 0) {
    return null;
  }

  // Select the subject with the highest coefficient
  let worstSubject = worstSubjects[0];
  let maxCoefficient = worstSubject.coefficient ?? 100;

  for (const subject of worstSubjects) {
    const coeff = subject.coefficient ?? 100;
    if (coeff > maxCoefficient) {
      maxCoefficient = coeff;
      worstSubject = subject;
    }
  }

  return worstSubject;
}

// Logic validated ✅ ATTENTION: Ensure to return the complete grade object
// Get the best grade adjusted by outOf; if tied, pick the one with the highest coefficient
export function getBestGrade(subjects: Subject[]): {
  grade: number;
  outOf: number;
  subject: Subject;
  name: string;
  coefficient: number;
  passedAt: string;
  createdAt: string;
} | null {
  let bestGrade = null;

  for (const subject of subjects) {
    for (const grade of subject.grades) {
      const percentage = grade.value / grade.outOf;
      const coefficient = grade.coefficient ?? 100; // Default to 100 if undefined

      if (bestGrade === null) {
        bestGrade = {
          grade: grade.value,
          outOf: grade.outOf,
          subject,
          percentage,
          coefficient,
          name: grade.name,
          passedAt: grade.passedAt,
          createdAt: grade.createdAt,
        };
      } else if (percentage > bestGrade.percentage) {
        bestGrade = {
          grade: grade.value,
          outOf: grade.outOf,
          subject,
          percentage,
          coefficient,
          name: grade.name,
          passedAt: grade.passedAt,
          createdAt: grade.createdAt,
        };
      } else if (percentage === bestGrade.percentage) {
        // If percentages are equal, compare coefficients
        if (coefficient > bestGrade.coefficient) {
          bestGrade = {
            grade: grade.value,
            outOf: grade.outOf,
            subject,
            percentage,
            coefficient,
            name: grade.name,
            passedAt: grade.passedAt,
            createdAt: grade.createdAt,
          };
        }
      }
    }
  }

  return bestGrade
    ? {
        grade: bestGrade.grade,
        outOf: bestGrade.outOf,
        subject: bestGrade.subject,
        name: bestGrade.name,
        coefficient: bestGrade.coefficient,
        passedAt: bestGrade.passedAt,
        createdAt: bestGrade.createdAt,
      }
    : null;
}

// Logic validated ✅ ATTENTION: Ensure to return the complete grade object
// Get the worst grade adjusted by outOf; if tied, pick the one with the highest coefficient
export function getWorstGrade(subjects: Subject[]): {
  grade: number;
  outOf: number;
  subject: Subject;
  name: string;
  coefficient: number;
  passedAt: string;
  createdAt: string;
} | null {
  let worstGrade = null;

  for (const subject of subjects) {
    for (const grade of subject.grades) {
      const percentage = grade.value / grade.outOf;
      const coefficient = grade.coefficient ?? 100; // Default to 100 if undefined

      if (worstGrade === null) {
        worstGrade = {
          grade: grade.value,
          outOf: grade.outOf,
          subject,
          percentage,
          coefficient,
          name: grade.name,
          passedAt: grade.passedAt,
          createdAt: grade.createdAt,
        };
      } else if (percentage < worstGrade.percentage) {
        worstGrade = {
          grade: grade.value,
          outOf: grade.outOf,
          subject,
          percentage,
          coefficient,
          name: grade.name,
          passedAt: grade.passedAt,
          createdAt: grade.createdAt,
        };
      } else if (percentage === worstGrade.percentage) {
        // If percentages are equal, compare coefficients
        if (coefficient > worstGrade.coefficient) {
          worstGrade = {
            grade: grade.value,
            outOf: grade.outOf,
            subject,
            percentage,
            coefficient,
            name: grade.name,
            passedAt: grade.passedAt,
            createdAt: grade.createdAt,
          };
        }
      }
    }
  }

  return worstGrade
    ? {
        grade: worstGrade.grade,
        outOf: worstGrade.outOf,
        subject: worstGrade.subject,
        name: worstGrade.name,
        coefficient: worstGrade.coefficient,
        passedAt: worstGrade.passedAt,
        createdAt: worstGrade.createdAt,
      }
    : null;
}

// Logic validated ✅ ATTENTION: Ensure to return the complete grade object
// Get the best grade inside a specific subject and its children
export function getBestGradeInSubject(
  subjects: Subject[],
  subjectId: string
): {
  grade: number;
  outOf: number;
  subject: Subject;
  name: string;
  coefficient: number;
  passedAt: string;
  createdAt: string;
} | null {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const childrenIds = getChildren(subjects, subjectId);
  const children = subjects.filter((s) => childrenIds.includes(s.id));

  const bestGrade = getBestGrade([subject, ...children]);
  return bestGrade;
}

// Logic validated ✅ ATTENTION: Ensure to return the complete grade object
// Get the worst grade inside a specific subject and its children
export function getWorstGradeInSubject(
  subjects: Subject[],
  subjectId: string
): {
  grade: number;
  outOf: number;
  subject: Subject;
  name: string;
  coefficient: number;
  passedAt: string;
  createdAt: string;
} | null {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const childrenIds = getChildren(subjects, subjectId);
  const children = subjects.filter((s) => childrenIds.includes(s.id));

  const worstGrade = getWorstGrade([subject, ...children]);
  return worstGrade;
}

// Logic validated ✅
// A function that returns an array of the IDs of the children of a subject (including all descendants)
export function getChildren(subjects: Subject[], subjectId: string): string[] {
  const directChildren = subjects.filter((s) => s.parentId === subjectId);
  let childrenIds = directChildren.map((child) => child.id);

  for (const child of directChildren) {
    childrenIds = childrenIds.concat(getChildren(subjects, child.id));
  }

  return childrenIds;
}

// Logic validated ✅
// Utility function to deep clone the subjects array
function deepCloneSubjects(subjects: Subject[]): Subject[] {
  return subjects.map((subject) => ({
    ...subject,
    grades: subject.grades.map((grade) => ({ ...grade })),
  }));
}

// Logic validated ✅
// Function to calculate the impact of a grade on the average
export function gradeImpact(
  gradeId: string,
  subjectId: string | undefined,
  subjects: Subject[],
  customAverage?: Average
): { difference: number; percentageChange: number | null } | null {
  // clone
  const subjectsCopy = deepCloneSubjects(subjects);

  // find the subject containing this grade
  let gradeSubject: Subject | null = null;
  let gradeIndex = -1;

  for (const subj of subjectsCopy) {
    const idx = subj.grades.findIndex((g) => g.id === gradeId);
    if (idx !== -1) {
      gradeSubject = subj;
      gradeIndex = idx;
      break;
    }
  }

  if (!gradeSubject || gradeIndex === -1) {
    return null; // Not found
  }

  // Average WITH the grade
  const avgWithGrade = average(subjectId, subjectsCopy, customAverage);

  // remove the grade
  gradeSubject.grades.splice(gradeIndex, 1);

  // Average WITHOUT the grade
  const avgWithoutGrade = average(subjectId, subjectsCopy, customAverage);

  if (avgWithGrade !== null && avgWithoutGrade !== null) {
    const difference = avgWithGrade - avgWithoutGrade;
    let percentageChange: number | null = null;
    if (avgWithoutGrade !== 0) {
      percentageChange = (difference / avgWithoutGrade) * 100;
    }
    return { difference, percentageChange };
  }
  return null;
}

export function buildCustomConfig(
  customAverage: Average
): Map<string, { customCoefficient: number | null; includeChildren: boolean }> {
  const cfg = new Map<string, { customCoefficient: number | null; includeChildren: boolean }>();
  for (const s of customAverage.subjects) {
    cfg.set(s.id, {
      customCoefficient: s.customCoefficient ?? null,
      includeChildren: s.includeChildren ?? true,
    });
  }
  return cfg;
}

// Logic validated ✅
// Function to calculate the impact of a subject on the general average
// Function to calculate the impact of a subject on another specified subject
export function subjectImpact(
  impactingSubjectId: string,
  impactedSubjectId: string | undefined,
  subjects: Subject[],
  customAverage?: Average
): { difference: number; percentageChange: number | null } | null {
  // Deep clone to avoid mutating real data
  const subjectsCopy = deepCloneSubjects(subjects);

  // Identify the subjects to exclude (impacting subject plus its children)
  const impactingIds = [impactingSubjectId, ...getChildren(subjectsCopy, impactingSubjectId)];

  // Average WITH the subject
  const avgWithSubject = average(impactedSubjectId, subjectsCopy, customAverage);

  // Remove impacting subject from the array
  const subjectsWithoutImpacting = subjectsCopy.filter((s) => !impactingIds.includes(s.id));

  // Average WITHOUT the subject
  const avgWithoutSubject = average(impactedSubjectId, subjectsWithoutImpacting, customAverage);

  if (avgWithSubject !== null && avgWithoutSubject !== null) {
    const difference = avgWithSubject - avgWithoutSubject;
    let percentageChange: number | null = null;
    if (avgWithoutSubject !== 0) {
      percentageChange = (difference / avgWithoutSubject) * 100;
    }
    return { difference, percentageChange };
  }
  return null;
}

// Logic validated ✅
// This function returns an array of the IDs of all the parents of a subject (including ancestors up to the root, not including the subject itself)
export function getParents(subjects: Subject[], subjectId: string): string[] {
  const parents: string[] = [];
  let currentSubject = subjects.find((s) => s.id === subjectId);

  while (currentSubject && currentSubject.parentId !== null) {
    parents.push(currentSubject.parentId);
    currentSubject = subjects.find((s) => s.id === currentSubject?.parentId);
  }

  return parents;
}

// Logic validated ✅
// Create dates array from start date to end date with a specific interval
export function createDateRange(
  start: Date,
  end: Date,
  interval: number
): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + interval);
  }

  return dates;
}

// Improved getTrend function to use actual dates
// Get trend of the average over time
export function getTrend(
  data: { date: Date; average: number | null }[]
): number {
  const filteredData = data.filter((entry) => entry.average !== null) as {
    date: Date;
    average: number;
  }[];

  const n = filteredData.length;
  if (n === 0) {
    return 0;
  }

  // Normalize the dates to avoid large numbers
  const firstTimestamp = filteredData[0].date.getTime();
  const xValues = filteredData.map(
    (entry) => (entry.date.getTime() - firstTimestamp) / (1000 * 3600 * 24)
  ); // Convert to days
  const yValues = filteredData.map((entry) => entry.average);

  const sumX = xValues.reduce((acc, x) => acc + x, 0);
  const sumY = yValues.reduce((acc, y) => acc + y, 0);
  const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
  const sumX2 = xValues.reduce((acc, x) => acc + x ** 2, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = n * sumX2 - sumX ** 2;

  if (denominator === 0) {
    return 0; // Cannot compute slope
  }

  const slope = numerator / denominator;

  return slope;
}

// Calculate the trend of a subject average over time
export function getSubjectTrend(
  subjects: Subject[],
  subjectId: string,
  period: Period
): number | null {
  const averages = averageOverTime(subjects, subjectId, period);

  if (averages.every((avg) => avg === null)) {
    return null;
  }

  const startDate = new Date(period.startAt);
  const endDate = new Date(period.endAt);
  const dates = createDateRange(startDate, endDate, 1);

  const data = averages.map((avg, index) => ({
    date: dates[index],
    average: avg,
  }));

  const trend = getTrend(data);

  return trend;
}

// Find the subject with the best (most positive) trend
export function getBestTrendSubject(
  subjects: Subject[],
  period: Period,
  isMainSubject: boolean = false
): { bestSubject: Subject; bestTrend: number } | null {
  let bestSubject: Subject | null = null;
  let bestTrend: number | null = null;

  let filteredSubjects = subjects;
  if (isMainSubject) {
    filteredSubjects = subjects.filter((s) => s.isMainSubject);
  }

  for (const subject of filteredSubjects) {
    const averages = averageOverTime(subjects, subject.id, period);

    if (averages.every((avg) => avg === null)) {
      continue; // Skip subjects with no averages
    }
    const startDate = new Date(period.startAt);
    const endDate = new Date(period.endAt);
    const dates = createDateRange(startDate, endDate, 1);

    const data = averages.map((avg, index) => ({
      date: dates[index],
      average: avg,
    }));

    const trend = getTrend(data);

    if (trend !== null && (bestTrend === null || trend > bestTrend)) {
      bestTrend = trend;
      bestSubject = subject;
    }
  }

  if (bestSubject === null || bestTrend === null) {
    return null;
  }
  //console.log(bestSubject, bestTrend);
  return { bestSubject, bestTrend };
}

// Find the subject with the worst (most negative) trend
export function getWorstTrendSubject(
  subjects: Subject[],
  period: Period,
  isMainSubject: boolean = false
): { worstSubject: Subject; worstTrend: number } | null {
  let worstSubject: Subject | null = null;
  let worstTrend: number | null = null;

  let filteredSubjects = subjects;
  if (isMainSubject) {
    filteredSubjects = subjects.filter((s) => s.isMainSubject);
  }

  for (const subject of filteredSubjects) {
    const averages = averageOverTime(subjects, subject.id, period);

    if (averages.every((avg) => avg === null)) {
      continue; // Skip subjects with no averages
    }

    const startDate = new Date(period.startAt);
    const endDate = new Date(period.endAt);
    const dates = createDateRange(startDate, endDate, 1);

    const data = averages.map((avg, index) => ({
      date: dates[index],
      average: avg,
    }));

    const trend = getTrend(data);

    if (trend !== null && (worstTrend === null || trend < worstTrend)) {
      worstTrend = trend;
      worstSubject = subject;
    }
  }
  if (worstSubject === null || worstTrend === null) {
    return null;
  }
  //console.log(worstSubject, worstTrend);
  return { worstSubject, worstTrend };
}

// Create a function that returns an array containing each date there is a new grade as parameter it takes the subjects array
export function getGradeDates(subjects: Subject[], subjectId?: string): Date[] {
  const dates: Date[] = [];
  // for each date check if there is a grade where the passedAt date is equal to the date

  if (subjectId) {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) return dates;

    subject.grades.forEach((grade) => {
      const passedAt = new Date(grade.passedAt);
      if (!dates.includes(passedAt)) {
        dates.push(passedAt);
      }
    });

    const childrenIds = getChildren(subjects, subjectId);
    const children = subjects.filter((s) => childrenIds.includes(s.id));

    children.forEach((child) => {
      child.grades.forEach((grade) => {
        const passedAt = new Date(grade.passedAt);
        if (!dates.includes(passedAt)) {
          dates.push(passedAt);
        }
      });
    });
  } else {
    subjects.forEach((subject) => {
      subject.grades.forEach((grade) => {
        const passedAt = new Date(grade.passedAt);
        if (!dates.includes(passedAt)) {
          dates.push(passedAt);
        }
      });
    });
  }
  return dates;
}

export function findPeriodBounds(period: Period, subjects: Subject[]): { startAt: Date; endAt: Date } {
  // if the period id is full-year or null, then the bounds are the start of the first date of the first period and the end of the last date of the last period if the end date is inferior to the current date otherwise the end date is the current date for the full year we must check if all grades are included in the bounds, if not we must extend the bounds to include all grades. If there is no period, we return the 1st of september of the current year and the current date and make sure to include all grades in the bounds
  if (period.id === "full-year" || period.id === null) {
    const startDate = new Date(new Date().getFullYear(), 8, 1); // 1st of september of the current year
    const endDate = new Date();
    const allGradeDates = getGradeDates(subjects);
    const firstGradeDate = allGradeDates.reduce((acc, date) => (date < acc ? date : acc), endDate);
    const lastGradeDate = allGradeDates.reduce((acc, date) => (date > acc ? date : acc), startDate);
    return { startAt: firstGradeDate < startDate ? firstGradeDate : startDate, endAt: lastGradeDate > endDate ? lastGradeDate : endDate };
  }
  // else we return the start and end date of the period
  return { startAt: new Date(period.startAt), endAt: new Date(period.endAt) };
}

// just a template for the full year period
export function fullYearPeriod(subjects: Subject[]): Period {
  return {
    id: "full-year",
    name: "Toute l'année",
    startAt: findPeriodBounds({ id: "full-year" } as Period, subjects).startAt.toISOString(),
    endAt: findPeriodBounds({ id: "full-year" } as Period, subjects).endAt.toISOString(),
    createdAt: new Date().toISOString(),
    userId: "",
  };
}