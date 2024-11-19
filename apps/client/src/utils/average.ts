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

    // Convertir le pourcentage moyen en note sur 20
    
  console.log(averagePercentage * 20, subject.name)

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