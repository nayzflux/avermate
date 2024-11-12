// // import { Subject } from "@/types/subject";

// // // This util function calculates the average of an array of numbers
// // export function average(subject: Subject, subjects: Subject[]): number {
// //     // Calculate subject average
// //     const grades = subject.grades;

// //     let values = 0;
// //     let coefficient = 0;

// //     for (const grade of grades) {
// //         values += (grade.value / grade.outOf) * grade.coefficient;
// //         coefficient += grade.coefficient;
// //     }

// //     let m = (values / coefficient) || 0;

// //     console.log(subject.name, m)

// //     // Calculate children subject average

// //     let sumCoeff = subject.coefficient;

// //     for (const child of subjects.filter((s) => s.parentId === subject.id)) {
// //         console.log(average(child, subjects) * subject.coefficient);
        
// //         m += average(child, subjects) * subject.coefficient;
// //         sumCoeff += subject.coefficient
// //     }

// //     if (sumCoeff !== 0) {
// //         m = m / sumCoeff;
// //     }

// //     return m*2000;
// // }

// // export function formatAverage(average: number): string {
// //     if (isNaN(average)) {
// //         return "c";
// //     }
// //     return (average/100).toFixed(2);
// // }

// type Grade = {
//   name: string;
//   coefficient: number;
//   value: number;
//   id: string;
//   createdAt: Date;
//   userId: string;
//   outOf: number;
//   passedAt: Date;
//   subjectId: string;
// };

// type Subject = {
//   name: string;
//   coefficient: number;
//   parentId: string | null;
//   id: string;
//   createdAt: Date;
//   userId: string;
//   grades: Grade[];
//   children?: Subject[];
//   average?: number;
// };

// // function calculateSubjectAverages(subjects: Subject[]): Subject[] {
// //   // Step 1: Build a Map of Subjects by ID
// //   const subjectMap = new Map<string, Subject>();
// //   subjects.forEach((subject) => {
// //     subject.children = []; // Initialize children array
// //     subjectMap.set(subject.id, subject);
// //   });

// //   // Step 2: Establish Parent-Child Relationships
// //   subjects.forEach((subject) => {
// //     if (subject.parentId) {
// //       const parent = subjectMap.get(subject.parentId);
// //       if (parent) {
// //         parent.children!.push(subject);
// //       }
// //     }
// //   });

// //   // Step 3: Recursive Function to Calculate Averages
// //   function calculateAverage(subject: Subject): number | undefined {
// //     if (subject.children!.length === 0) {
// //       // Leaf subject: Calculate weighted average of grades
// //       if (subject.grades.length === 0) {
// //         subject.average = undefined; // No grades, average is undefined
// //       } else {
// //         const total = subject.grades.reduce((sum, grade) => {
// //           const gradeValue = grade.value / 100;
// //           const gradeCoefficient = grade.coefficient / 100;
// //           return sum + gradeValue * gradeCoefficient;
// //         }, 0);

// //         const totalCoefficient = subject.grades.reduce((sum, grade) => {
// //           return sum + grade.coefficient / 100;
// //         }, 0);

// //         subject.average = totalCoefficient !== 0 ? total / totalCoefficient : undefined;
// //       }
// //     } else {
// //       // Parent subject: Calculate weighted average of children's averages
// //       // First, calculate averages for all children
// //       const childAverages = subject.children!.map((child) => {
// //         const childAverage = calculateAverage(child);
// //         return {
// //           average: childAverage,
// //           coefficient: child.coefficient / 100,
// //         };
// //       });

// //       // Filter out children without a valid average
// //       const validChildAverages = childAverages.filter(
// //         (child) => child.average !== undefined
// //       );

// //       if (validChildAverages.length === 0) {
// //         subject.average = undefined; // No valid child averages
// //       } else {
// //         const total = validChildAverages.reduce((sum, child) => {
// //           return sum + child.average! * child.coefficient;
// //         }, 0);

// //         const totalCoefficient = validChildAverages.reduce((sum, child) => {
// //           return sum + child.coefficient;
// //         }, 0);

// //         subject.average = totalCoefficient !== 0 ? total / totalCoefficient : undefined;
// //       }
// //     }
// //     return subject.average;
// //   }

// //   // Find root subjects (subjects without parents)
// //   const rootSubjects = subjects.filter((subject) => subject.parentId === null);

// //   // Calculate averages starting from root subjects
// //   rootSubjects.forEach((subject) => calculateAverage(subject));

// //   return subjects;
// // }


// // export function average(subject: Subject, subjects: Subject[]): number | undefined {
// //   return calculateSubjectAverages(subjects).find(s => s.id === subject.id)?.average;
// // }

// // export function formatAverage(average: number|undefined): string {
// //     if (!average) return "N/A";
    
// //   return (average).toFixed(2);
// // }


// type Grade = {
//   id: string;
//   value: number; // scaled by 100
//   outOf: number; // scaled by 100
//   coefficient: number; // scaled by 100
// };

// type Subject = {
//   id: string;
//   name: string;
//   parentId: string | null;
//   depth: number;
//   grades: Grade[];
//   children?: Subject[];
// };

// // Function to calculate the weighted average for a subject's grades
// function calculateGradeAverage(grades: Grade[]): number | null {
//   if (grades.length === 0) return null;

//   let totalWeightedScore = 0;
//   let totalWeight = 0;

//   for (const grade of grades) {
//     const value = grade.value / 100;
//     const outOf = grade.outOf / 100;
//     const coefficient = grade.coefficient / 100;

//     // Calculate the normalized grade (on a scale of 20)
//     const normalizedGrade = (value / outOf) * 20;
//     totalWeightedScore += normalizedGrade * coefficient;
//     totalWeight += coefficient;
//   }

//   return totalWeight > 0 ? totalWeightedScore / totalWeight : null;
// }

// // Recursive function to calculate the average for a subject and its children
// function calculateSubjectAverage(subject: Subject, subjectsMap: Map<string, Subject>): number | null {
//   // Calculate the average for the current subject's grades
//   const ownAverage = calculateGradeAverage(subject.grades);

//   // Recursively calculate averages for child subjects
//   const childSubjects = subjectsMap.get(subject.id)?.children || [];
//   let totalWeightedScore = 0;
//   let totalWeight = 0;

//   if (childSubjects.length > 0) {
//     for (const child of childSubjects) {
//       const childAverage = calculateSubjectAverage(child, subjectsMap);
//       if (childAverage !== null) {
//         const coefficient = 1; // Default coefficient for subjects
//         totalWeightedScore += childAverage * coefficient;
//         totalWeight += coefficient;
//       }
//     }
//   }

//   // Combine the child's averages with the parent's grades, if any
//   if (ownAverage !== null) {
//     totalWeightedScore += ownAverage;
//     totalWeight += 1;
//   }

//   return totalWeight > 0 ? totalWeightedScore / totalWeight : null;
// }

// // Build a map of subjects and link their children
// function buildSubjectsMap(subjects: Subject[]): Map<string, Subject> {
//   const subjectsMap = new Map<string, Subject>();

//   // Create a map with subjects keyed by their ID
//   for (const subject of subjects) {
//     subjectsMap.set(subject.id, { ...subject, children: [] });
//   }

//   // Populate children arrays for each subject
//   for (const subject of subjects) {
//     if (subject.parentId !== null && subjectsMap.has(subject.parentId)) {
//       subjectsMap.get(subject.parentId)!.children!.push(subject);
//     }
//   }

//   return subjectsMap;
// }

// // Main function to calculate averages for all subjects
// export function calculateAllAverages(subjects: Subject[]): Map<string, number | null> {
//   const subjectsMap = buildSubjectsMap(subjects);
//   const averagesMap = new Map<string, number | null>();

//   for (const subject of subjects) {
//     if (subject.parentId === null) {
//       const average = calculateSubjectAverage(subject, subjectsMap);
//       averagesMap.set(subject.id, average);
//     }
//   }

//   return averagesMap;
// }

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

  // Ajuster le coefficient de la matière (diviser par 100)
  const subjectCoefficient = (subject.coefficient ?? 100) / 100;

  // Calculer le pourcentage des notes de la matière actuelle
  if (subject.grades && subject.grades.length > 0) {
    let subjectTotalWeightedPercentages = 0;
    let subjectTotalCoefficients = 0;

    for (const grade of subject.grades) {
      // Ajuster les valeurs (diviser par 100)
      const gradeValue = grade.value / 100;
      const outOf = grade.outOf / 100;
      const coefficient = grade.coefficient / 100;

      // Vérifier que outOf n'est pas zéro pour éviter une division par zéro
      if (outOf === 0) continue;

      // Calculer le pourcentage de la note
      const percentage = gradeValue / outOf;

      // Appliquer le coefficient de la note
      subjectTotalWeightedPercentages += percentage * coefficient;
      subjectTotalCoefficients += coefficient;
    }

    if (subjectTotalCoefficients > 0) {
      // Calculer la moyenne pondérée des pourcentages pour la matière
      const subjectAveragePercentage =
        subjectTotalWeightedPercentages / subjectTotalCoefficients;

      // Appliquer le coefficient de la matière
      totalWeightedPercentages += subjectAveragePercentage * subjectCoefficient;
      totalCoefficients += subjectCoefficient;
    }
  }

  // Calculer la moyenne des enfants
  const childSubjects = subjects.filter((s) => s.parentId === subject.id);
  for (const child of childSubjects) {
    const childAverage = calculateAverageForSubject(child, subjects);
    if (childAverage !== null) {
      // Convertir la moyenne de l'enfant en pourcentage (puisque c'est sur 20)
      const childPercentage = childAverage / 20;

      // Ajuster le coefficient de la matière enfant (diviser par 100)
      const childCoefficient = (child.coefficient ?? 100) / 100;

      // Ajouter la moyenne pondérée de l'enfant
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

  // Convertir le pourcentage moyen en note sur 20
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

