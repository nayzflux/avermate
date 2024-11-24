import { Subject } from "@/types/subject";

export function average(
  subjectId: string | undefined,
  subjects: Subject[]
): number | null {
  // Si subjectId est indéfini, on calcule la moyenne générale
  if (!subjectId) {
    // Récupérer les matières racines (sans parent)
    const rootSubjects = subjects.filter((s) => s.parentId === null);
    return calculateAverageForSubjects(rootSubjects, subjects);
  }

  // Trouver la matière avec l'ID donné
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

  // Calculer les notes directes de la matière
  if (subject.grades && subject.grades.length > 0) {
    for (const grade of subject.grades) {
      const gradeValue = grade.value / 100;
      const outOf = grade.outOf / 100;
      const gradeCoefficient = grade.coefficient / 100;

      if (outOf === 0) continue;

      const percentage = gradeValue / outOf;

      totalWeightedPercentages += percentage * gradeCoefficient;
      totalCoefficients += gradeCoefficient;
    }
  }

  // Calculer les moyennes des sous-matières
  const childSubjects = subjects.filter((s) => s.parentId === subject.id);

  for (const child of childSubjects) {
    const childAverage = calculateAverageForSubject(child, subjects);
    if (childAverage !== null) {
      const childPercentage = childAverage / 20;
      const childCoefficient = (child.coefficient ?? 100) / 100;

      totalWeightedPercentages += childPercentage * childCoefficient;
      totalCoefficients += childCoefficient;
    }
  }

  // Si aucune note ni de la matière ni des enfants, retourner null
  if (totalCoefficients === 0) {
    return null;
  }

  // Calculer la moyenne pondérée des pourcentages
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
    const subjectAverage = calculateAverageForSubject(subject, allSubjects);
    if (subjectAverage !== null) {
      // Convertir la moyenne de la matière en pourcentage
      const subjectPercentage = subjectAverage / 20;

      // Ajuster le coefficient de la matière (diviser par 100)
      const subjectCoefficient = (subject.coefficient ?? 100) / 100;

      // Ajouter la moyenne pondérée de la matière
      totalWeightedPercentages += subjectPercentage * subjectCoefficient;
      totalCoefficients += subjectCoefficient;
    }
  }

  if (totalCoefficients === 0) {
    return null;
  }

  const averagePercentage = totalWeightedPercentages / totalCoefficients;

  return averagePercentage * 20;
}

export function averageOverTime(
  subjects: Subject[],
  subjectId: string | undefined,
  dates: Date[],
): number[] {
  return dates.map((date) => {
    const subjectsWithGrades = subjects.map((subject) => {
      const grades = subject.grades.filter((grade) => new Date(grade.passedAt) <= date);
      return { ...subject, grades };
    });

    return average(subjectId, subjectsWithGrades) ?? 0;
  });
}

// Compute the average for each subject and return an array of objects with subject ID and its average
export function getSubjectAverages(subjects: Subject[]): { id: string; average: number }[] {
  return subjects
    .map((subject) => {
      const average = calculateAverageForSubject(subject, subjects);
      return average !== null ? { id: subject.id, average } : null;
    })
    .filter((entry): entry is { id: string; average: number } => entry !== null);
}


// Get all subjects with the best average
export function getBestSubjects(subjects: Subject[]): Subject[] {
  const subjectAverages = getSubjectAverages(subjects);
  const bestAverage = Math.max(...subjectAverages.map((entry) => entry.average));

  return subjects.filter((subject) =>
    subjectAverages.some((entry) => entry.id === subject.id && entry.average === bestAverage)
  );
}

// Get best subject average comparaison with the others main subjects (do the average of the main subjects and give what percentage higher the best subject is compared to the average of the main subjects)
export function getBestSubjectAverageComparaison(subjects: Subject[]): number {
  const mainSubjects = subjects.filter((subject) => subject.isMainSubject);
  const mainSubjectsAverages = getSubjectAverages(mainSubjects);

  if (mainSubjectsAverages.length === 0) {
    // Handle the case where there are no main subjects
    return 0; // or throw an error, or decide on an appropriate default value
  }

  const mainSubjectsAverage = mainSubjectsAverages.reduce((acc, entry) => acc + entry.average, 0) / mainSubjectsAverages.length;

  const bestSubjects = getBestSubjects(subjects);
  const bestSubjectAverage = Math.max(...bestSubjects.map((subject) => calculateAverageForSubject(subject, subjects) ?? 0));

  return ((bestSubjectAverage - mainSubjectsAverage) / mainSubjectsAverage) * 100;
}

// Get all subjects with the worst average
export function getWorstSubjects(subjects: Subject[]): Subject[] {
  const subjectAverages = getSubjectAverages(subjects);
  const worstAverage = Math.min(...subjectAverages.map((entry) => entry.average));

  return subjects.filter((subject) =>
    subjectAverages.some((entry) => entry.id === subject.id && entry.average === worstAverage)
  );
}

// Get worst subject average comparaison with the others main subjects (do the average of the main subjects and give what percentage lower the worst subject is compared to the average of the main subjects)
export function getWorstSubjectAverageComparaison(subjects: Subject[]): number {
  const mainSubjects = subjects.filter((subject) => subject.isMainSubject);
  const mainSubjectsAverages = getSubjectAverages(mainSubjects);

  if (mainSubjectsAverages.length === 0) {
  // Handle the case where there are no main subjects
    return 0; // or throw an error, or decide on an appropriate default value
  }

  const mainSubjectsAverage = mainSubjectsAverages.reduce((acc, entry) => acc + entry.average, 0) / mainSubjectsAverages.length;

  const worstSubjects = getWorstSubjects(subjects);
  const worstSubjectAverage = Math.min(...worstSubjects.map((subject) => calculateAverageForSubject(subject, subjects) ?? 0));

  return ((mainSubjectsAverage - worstSubjectAverage) / mainSubjectsAverage) * 100;
}

// Get the best main subject or fallback to the best subject
export function getBestMainSubject(subjects: Subject[]): Subject | null {
  const mainSubjects = subjects.filter((subject) => subject.isMainSubject);
  const bestMainSubjects = getBestSubjects(mainSubjects);

  if (bestMainSubjects.length > 0) {
    return bestMainSubjects[0]; // Return the first one or apply further logic if needed
  }

  const bestSubjects = getBestSubjects(subjects);
  return bestSubjects.length > 0 ? bestSubjects[0] : null;
}

// Get the worst main subject or fallback to the worst subject
export function getWorstMainSubject(subjects: Subject[]): Subject | null {
  const mainSubjects = subjects.filter((subject) => subject.isMainSubject);
  const worstMainSubjects = getWorstSubjects(mainSubjects);

  if (worstMainSubjects.length > 0) {
    return worstMainSubjects[0]; // Return the first one or apply further logic if needed
  }

  const worstSubjects = getWorstSubjects(subjects);
  return worstSubjects.length > 0 ? worstSubjects[0] : null;
}

// Get the best grade adjusted by outOf
// Get the subject with the best average; if tied, pick the one with the highest coefficient
export function getBestSubject(subjects: Subject[]): Subject | null {
  const subjectAverages = getSubjectAverages(subjects);
  const bestAverage = Math.max(...subjectAverages.map((entry) => entry.average));

  // Filter subjects with the best average
  const bestSubjects = subjects.filter((subject) =>
    subjectAverages.some((entry) => entry.id === subject.id && entry.average === bestAverage)
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

// Get the subject with the worst average; if tied, pick the one with the highest coefficient
export function getWorstSubject(subjects: Subject[]): Subject | null {
  const subjectAverages = getSubjectAverages(subjects);
  const worstAverage = Math.min(...subjectAverages.map((entry) => entry.average));

  // Filter subjects with the worst average
  const worstSubjects = subjects.filter((subject) =>
    subjectAverages.some((entry) => entry.id === subject.id && entry.average === worstAverage)
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

// Get the best grade adjusted by outOf; if tied, pick the one with the highest coefficient
export function getBestGrade(subjects: Subject[]): { grade: number; outOf: number; subject: Subject; name: String } | null {
  let bestGrade = null;

  for (const subject of subjects) {
    for (const grade of subject.grades) {
      const percentage = grade.value / grade.outOf;
      const coefficient = grade.coefficient ?? 100; // Default to 100 if undefined

      if (bestGrade === null) {
        bestGrade = { grade: grade.value, outOf: grade.outOf, subject, percentage, coefficient, name: grade.name };
      } else if (percentage > bestGrade.percentage) {
        bestGrade = { grade: grade.value, outOf: grade.outOf, subject, percentage, coefficient, name: grade.name };
      } else if (percentage === bestGrade.percentage) {
        // If percentages are equal, compare coefficients
        if (coefficient > bestGrade.coefficient) {
          bestGrade = { grade: grade.value, outOf: grade.outOf, subject, percentage, coefficient, name: grade.name };
        }
      }
    }
  }

  return bestGrade
    ? { grade: bestGrade.grade, outOf: bestGrade.outOf, subject: bestGrade.subject, name: bestGrade.name }
    : null;
}

// Get the worst grade adjusted by outOf; if tied, pick the one with the highest coefficient
export function getWorstGrade(subjects: Subject[]): { grade: number; outOf: number; subject: Subject; name: String } | null {
  let worstGrade = null;

  for (const subject of subjects) {
    for (const grade of subject.grades) {
      const percentage = grade.value / grade.outOf;
      const coefficient = grade.coefficient ?? 100; // Default to 100 if undefined

      if (worstGrade === null) {
        worstGrade = { grade: grade.value, outOf: grade.outOf, subject, percentage, coefficient, name: grade.name };
      } else if (percentage < worstGrade.percentage) {
        worstGrade = { grade: grade.value, outOf: grade.outOf, subject, percentage, coefficient, name: grade.name };
      } else if (percentage === worstGrade.percentage) {
        // If percentages are equal, compare coefficients
        if (coefficient > worstGrade.coefficient) {
          worstGrade = { grade: grade.value, outOf: grade.outOf, subject, percentage, coefficient, name: grade.name };
        }
      }
    }
  }

  return worstGrade
    ? { grade: worstGrade.grade, outOf: worstGrade.outOf, subject: worstGrade.subject, name: worstGrade.name }
    : null;
}

// Get the best grade inside a specific subject and its childrens
export function getBestGradeInSubject(subjects: Subject[], subjectId: string): { grade: number; outOf: number; subject: Subject; name: String } | null {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const childrenIds = getChildren(subjects, subjectId);
  const children = subjects.filter((s) => childrenIds.includes(s.id));

  const bestGrade = getBestGrade([subject, ...children]);

  return bestGrade;
}

// Get the worst grade inside a specific subject and its childrens
export function getWorstGradeInSubject(subjects: Subject[], subjectId: string): { grade: number; outOf: number; subject: Subject; name: String } | null {
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;

  const childrenIds = getChildren(subjects, subjectId);
  const children = subjects.filter((s) => childrenIds.includes(s.id));

  const worstGrade = getWorstGrade([subject, ...children]);
  return worstGrade;
}

// A function that retruns an array of the id of the children of a subject (remember that a subject can have n children)
export function getChildren(subjects: Subject[], subjectId: string): string[] {
  const directChildren = subjects.filter((s) => s.parentId === subjectId);
  let childrenIds = directChildren.map((child) => child.id);

  for (const child of directChildren) {
    childrenIds = childrenIds.concat(getChildren(subjects, child.id));
  }

  return childrenIds;
}



// Utility function to deep clone the subjects array
function deepCloneSubjects(subjects: Subject[]): Subject[] {
  return subjects.map((subject) => ({
    ...subject,
    grades: subject.grades.map((grade) => ({ ...grade })),
  }));
}

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

// Function to calculate the impact of a subject on the general average
export function subjectImpact(
  subjectId: string,
  subjects: Subject[]
): { difference: number; percentageChange: number | null } | null {
  // Deep clone the subjects array to prevent mutations
  const subjectsCopy = deepCloneSubjects(subjects);

  // Get the list of subject IDs to exclude (the subject and all its children)
  const subjectsToExclude = [subjectId, ...getChildren(subjectsCopy, subjectId)];

  // Compute the general average with the subject included
  const averageWithSubject = average(undefined, subjectsCopy);

  // Remove the subject and its children from the subjects array
  const subjectsWithoutSubject = subjectsCopy.filter(
    (subject) => !subjectsToExclude.includes(subject.id)
  );

  // Compute the general average without the subject
  const averageWithoutSubject = average(undefined, subjectsWithoutSubject);

  // Compute the impact
  if (averageWithSubject !== null && averageWithoutSubject !== null) {
    const difference = averageWithSubject - averageWithoutSubject;
    let percentageChange: number | null = null;
    if (averageWithoutSubject !== 0) {
      percentageChange = (difference / averageWithoutSubject) * 100;
    }
    return { difference, percentageChange };
  } else {
    return null;
  }
}

// This function returns an array of the id of all the parents of a subject (we are including the parent of the parent and so on until we reach the root and we are not including the subject itself)
export function getParents(subjects: Subject[], subjectId: string): string[] {
  const parents: string[] = [];
  let currentSubject = subjects.find((s) => s.id === subjectId);

  while (currentSubject && currentSubject.parentId !== null) {
    parents.push(currentSubject.parentId);
    currentSubject = subjects.find((s) => s.id === currentSubject.parentId);
  }

  return parents;
}
