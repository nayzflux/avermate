import SubjectWrapper from "./subject-wrapper";

export default function SubjectPage({
  params,
}: {
  params: { subjectId: string; periodId: string };
}) {
  return (
    <SubjectWrapper subjectId={params.subjectId} periodId={params.periodId} />
  );
}
