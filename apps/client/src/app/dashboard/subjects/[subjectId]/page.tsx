import SubjectWrapper from "./subject-wrapper";

export default function SubjectPage({
  params,
}: {
  params: { subjectId: string };
}) {
  return <SubjectWrapper subjectId={params.subjectId} />;
}
