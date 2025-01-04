import AboutClient from "./AboutClient";

export default async function AboutPage() {
  // 1. Do server-side fetch calls
  const owner = "nayzflux";
  const repoName = "avermate";

  const [repoRes, contributorsRes, tagsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      next: { revalidate: 3600 },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors`, {
      next: { revalidate: 3600 },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repoName}/tags`, {
      next: { revalidate: 3600 },
    }),
  ]);

  const [repo, contributorsData, tags] = await Promise.all([
    repoRes.json(),
    contributorsRes.json(),
    tagsRes.json(),
  ]);

  // 2. If you need translations in a server component, you could do:
  // const t = await getTranslator({ locale: /* your locale */ }, "Settings.About");
  // …but typically we keep UI and client-l10n in a Client Component

  // 3. Pass the fetched data down to a Client Component
  return (
    <AboutClient repo={repo} contributorsData={contributorsData} tags={tags} />
  );
}
