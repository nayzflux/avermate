import { Subject } from "@/types/subject";
import { startOfDay } from "date-fns";

/**
 * TODO: Verify the consistency of the returned grades/averages values (e.g. null, 0, and more importantly, if we return the values *100 or not) (WE ARE DEALING WITH GRADES/COEFS AND OUTOF VALUES multiplied by 100 because we don't want to deal with floating numbers in the database but because this is a frontend function, we need to divide by 100 to get the real value)
 **/

export function average(
  subjectId: string | undefined,
  subjects: Subject[]
): number | null {
  // If subjectId is undefined, calculate the general average
  if (!subjectId) {
    // Get root subjects (without parent)
    const rootSubjects = subjects.filter((s) => s.parentId === null);
    console.log(rootSubjects);
    return calculateAverageForSubjects(rootSubjects, subjects);
  }

  // Find the subject with the given ID
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  return calculateAverageForSubject(subject, subjects);
}

function calculateAverageForSubject(
  subject: Subject,
  subjects: Subject[]
): number | null {
  let totalWeightedPercentages = 0;
  let totalCoefficients = 0;

  // Calculate direct grades of the subject
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

  // Get the current subject (if non-display) and all non-display descendants
  const allNonDisplaySubjects = getAllNonDisplaySubjects(subject, subjects);

  // Filter out the subject itself because we’ve already handled its grades above
  // (If you prefer, you could omit the subject itself from getAllNonDisplaySubjects 
  //  and handle that logic separately)
  const descendantsOnly = allNonDisplaySubjects.filter((s) => s.id !== subject.id);

  for (const child of descendantsOnly) {
    const childAverage = calculateAverageForSubject(child, subjects);
    if (childAverage !== null) {
      const childPercentage = childAverage / 20;
      const childCoefficient = (child.coefficient ?? 100) / 100;

      totalWeightedPercentages += childPercentage * childCoefficient;
      totalCoefficients += childCoefficient;
    }
  }

  // If no coefficients were added at all (no grades + no children with grades)
  if (totalCoefficients === 0) {
    return null;
  }

  const averagePercentage = totalWeightedPercentages / totalCoefficients;
  return averagePercentage * 20;
}



function calculateAverageForSubjects(
  subjects: Subject[],
  allSubjects: Subject[]
): number | null {
  let totalWeightedPercentages = 0;
  let totalCoefficients = 0;

  for (const subject of subjects) {
    const allNonDisplaySubjects = getAllNonDisplaySubjects(subject, allSubjects);

    for (const nonDisplaySubject of allNonDisplaySubjects) {
      const subjectAverage = calculateAverageForSubject(nonDisplaySubject, allSubjects);
      if (subjectAverage !== null) {
        const subjectPercentage = subjectAverage / 20;
        const subjectCoefficient = (nonDisplaySubject.coefficient ?? 100) / 100;

        totalWeightedPercentages += subjectPercentage * subjectCoefficient;
        totalCoefficients += subjectCoefficient;
      }
    }
  }

  if (totalCoefficients === 0) {
    return null;
  }

  const averagePercentage = totalWeightedPercentages / totalCoefficients;
  return averagePercentage * 20;
}



function getAllNonDisplaySubjects(
  subject: Subject,
  subjects: Subject[]
): Subject[] {
  const children = subjects.filter((s) => s.parentId === subject.id);

  let nonDisplayList: Subject[] = [];

  // If the subject itself is not a display subject, include it
  if (!subject.isDisplaySubject) {
    nonDisplayList.push(subject);
  }

  // Now process the children
  for (const child of children) {
    if (child.isDisplaySubject) {
      // Recursively get non-display subjects from display subject children
      nonDisplayList = nonDisplayList.concat(getAllNonDisplaySubjects(child, subjects));
    } else {
      // Non-display child subjects are included directly
      nonDisplayList.push(child);
    }
  }

  return nonDisplayList;
}



export function averageOverTime(
  subjects: Subject[],
  subjectId: string | undefined,
  startDate: Date,
  endDate: Date
): (number | null)[] {
  const normalizedStartDate = startOfDay(startDate);
  const normalizedEndDate = startOfDay(endDate);
  const gradeDates = getGradeDates(subjects, subjectId).filter(
    (date) => date >= normalizedStartDate && date <= normalizedEndDate
  );
  const dates = createDateRange(normalizedStartDate, normalizedEndDate, 1);

  return dates.map((date, index) => {
    if (
      gradeDates.some((gradeDate) => gradeDate.getTime() === date.getTime()) ||
      index === dates.length - 1
    ) {
      const subjectsWithGrades = subjects.map((subject) => ({
        ...subject,
        grades: subject.grades.filter(
          (grade) => new Date(grade.passedAt) <= date
        ),
      }));
      return average(subjectId, subjectsWithGrades);
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
  subjects: Subject[]
): { difference: number; percentageChange: number | null } | null {
  // Deep clone the subjects array to prevent mutations
  const subjectsCopy = deepCloneSubjects(subjects);

  // Find the subject and index of the grade
  let gradeSubject: Subject | null = null;
  let gradeIndex = -1;

  for (const subject of subjectsCopy) {
    const index = subject.grades.findIndex((grade) => grade.id === gradeId);
    if (index !== -1) {
      gradeSubject = subject;
      gradeIndex = index;
      break;
    }
  }

  if (!gradeSubject || gradeIndex === -1) {
    // Grade not found
    return null;
  }

  // Compute the average with the grade included
  const averageWithGrade = average(subjectId, subjectsCopy);

  // Remove the grade from the grades array
  gradeSubject.grades.splice(gradeIndex, 1);

  // Compute the average without the grade
  const averageWithoutGrade = average(subjectId, subjectsCopy);

  // Compute the impact
  if (averageWithGrade !== null && averageWithoutGrade !== null) {
    const difference = averageWithGrade - averageWithoutGrade;
    let percentageChange: number | null = null;
    if (averageWithoutGrade !== 0) {
      percentageChange = (difference / averageWithoutGrade) * 100;
    }
    return { difference, percentageChange };
  } else {
    return null;
  }
}

// Logic validated ✅
// Function to calculate the impact of a subject on the general average
// Function to calculate the impact of a subject on another specified subject
export function subjectImpact(
  impactingSubjectId: string,
  impactedSubjectId: string | undefined,
  subjects: Subject[]
): { difference: number; percentageChange: number | null } | null {
  // Deep clone the subjects array to prevent mutations
  const subjectsCopy = deepCloneSubjects(subjects);

  // Identify the subjects to exclude (impacting subject and its children)
  const subjectsToExclude = [
    impactingSubjectId,
    ...getChildren(subjectsCopy, impactingSubjectId),
  ];

  // Compute the average with the impacting subject included
  const averageWithImpact = average(impactedSubjectId, subjectsCopy);

  // Remove the impacting subject and its children from the subjects array
  const subjectsWithoutImpacting = subjectsCopy.filter(
    (subject) => !subjectsToExclude.includes(subject.id)
  );

  // Compute the average without the impacting subject
  const averageWithoutImpact = average(impactedSubjectId, subjectsWithoutImpacting);

  // Compute the impact
  if (averageWithImpact !== null && averageWithoutImpact !== null) {
    const difference = averageWithImpact - averageWithoutImpact;
    let percentageChange: number | null = null;
    if (averageWithoutImpact !== 0) {
      percentageChange = (difference / averageWithoutImpact) * 100;
    }
    return { difference, percentageChange };
  } else {
    return null;
  }
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
  startDate: Date,
  endDate: Date
): number | null {
  const averages = averageOverTime(subjects, subjectId, startDate, endDate);

  if (averages.every((avg) => avg === null)) {
    return null;
  }

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
  startDate: Date,
  endDate: Date,
  isMainSubject: boolean = false
): { bestSubject: Subject; bestTrend: number } | null {
  let bestSubject: Subject | null = null;
  let bestTrend: number | null = null;

  let filteredSubjects = subjects;
  if (isMainSubject) {
    filteredSubjects = subjects.filter((s) => s.isMainSubject);
  }

  for (const subject of filteredSubjects) {
    const averages = averageOverTime(subjects, subject.id, startDate, endDate);

    if (averages.every((avg) => avg === null)) {
      continue; // Skip subjects with no averages
    }

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
  startDate: Date,
  endDate: Date,
  isMainSubject: boolean = false
): { worstSubject: Subject; worstTrend: number } | null {
  let worstSubject: Subject | null = null;
  let worstTrend: number | null = null;

  let filteredSubjects = subjects;
  if (isMainSubject) {
    filteredSubjects = subjects.filter((s) => s.isMainSubject);
  }

  for (const subject of filteredSubjects) {
    const averages = averageOverTime(subjects, subject.id, startDate, endDate);

    if (averages.every((avg) => avg === null)) {
      continue; // Skip subjects with no averages
    }

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
