import Logo from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

// Optional: Revalidate every hour to keep data fresh
export const revalidate = 3600;

export default async function AboutPage() {
  const owner = "nayzflux";
  const repoName = "avermate";

  // Fetch repo data
  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}`,
    {
      headers: {
        // If you have a GITHUB_TOKEN, add:
        // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      },
      next: { revalidate: 3600 },
    }
  );
  const repo = await repoRes.json();

  // Fetch contributors data
  const contributorsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/contributors`,
    {
      headers: {
        // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      },
      next: { revalidate: 3600 },
    }
  );
  const contributorsData = await contributorsRes.json();

  // Fetch tags to get version info
  const tagsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/tags`,
    {
      headers: {
        // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      },
      next: { revalidate: 3600 },
    }
  );
  const tags = await tagsRes.json();
  const version = tags && tags.length > 0 ? tags[0].name : "Beta v1.0.0";

  const githubLink = `https://github.com/${owner}/${repoName}`;
  const stars = repo?.stargazers_count ?? 0;

  // If you'd like to provide some useful links dynamically, you could also fetch them from somewhere.
  // For now, we’ll keep them static or inferred.
  const usefulLinks = [
    { name: "Problèmes GitHub", url: `${githubLink}/issues` },
    { name: "Serveur Discord ", url: `https://discord.gg/DSCMg3MUzu` },
    { name: "Page d'acceuil", url: `/` },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="pb-4">
              <Logo />
            </div>
            <CardTitle>À propos d'{repo?.name ?? "Your App"}</CardTitle>
            <CardDescription>
              {repo?.description ?? "Prenez le contrôle de vos notes"}
            </CardDescription>
          </div>
          <Badge variant="secondary">{version}</Badge>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              <Link
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Voir sur GitHub
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{stars}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Contributeurs</h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(contributorsData) &&
              contributorsData.length > 0 ? (
                contributorsData.map((contributor: any, index: number) => (
                  <Link
                    key={index}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={contributor.avatar_url}
                        alt={contributor.login}
                      />
                      <AvatarFallback>
                        {contributor.login
                          .split(" ")
                          .map((n: string) => n[0]?.toUpperCase())
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ))
              ) : (
                <p>
                  Aucun contributeur pour l'instant. Soyez le premier à
                  contribuer!
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Liens utiles</h3>
            <div className="grid gap-2">
              {usefulLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {link.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
