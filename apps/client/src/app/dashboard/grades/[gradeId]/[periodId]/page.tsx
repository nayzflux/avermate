import GradeWrapper from "./grade-wrapper";

export default function SubjectPage({
  params,
}: {
  params: { gradeId: string, periodId: string };
}) {
  return <GradeWrapper gradeId={params.gradeId} periodId={params.periodId} />;
}
