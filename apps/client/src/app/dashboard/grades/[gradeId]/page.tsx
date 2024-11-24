import GradeWrapper from "./grade-wrapper";

export default function SubjectPage({
  params,
}: {
  params: { gradeId: string };
}) {
  return <GradeWrapper gradeId={params.gradeId} />;
}
