import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";
import { Session, User } from "better-auth/types";
import { authClient } from "@/lib/auth";

export default function WelcomeScreen() {
  const { data: session } = authClient.useSession() as unknown as {
    data: { session: Session; user: User };
  };

  // -- PWA install logic --
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallPrompt(e); // store the event
      setCanInstall(true); // show the button
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Listen for a successful install
  useEffect(() => {
    function handleAppInstalled() {
      disableInAppInstallPrompt();
    }

    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    // @ts-ignore - 'prompt()' is part of the BeforeInstallPromptEvent
    const result = await (installPrompt as any).prompt();
    console.log(`Install prompt outcome: ${result.outcome}`);
    disableInAppInstallPrompt();
  };

  function disableInAppInstallPrompt() {
    setInstallPrompt(null);
    setCanInstall(false);
  }
  // -- end PWA install logic --

  return (
    <div className="text-center space-y-8">
      {/* Optional fancy icons */}
      {/* 
      <div className="relative inline-block">
        <Rocket className="w-24 h-24 mx-auto text-primary" />
        <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-0 animate-pulse" />
      </div> 
      */}

      <h2 className="text-4xl font-bold text-primary">
        Bienvenue sur Avermate,{" "}
        {session?.user?.name ? session.user.name.split(" ")[0] : ""}! 🎉
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Nous sommes ravis de vous accueillir à bord. Préparez-vous à décoller
        vers une expérience exceptionnelle !
      </p>

      <div className="bg-secondary/50 rounded-lg p-6 max-w-xl mx-auto space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Ce qui vous attend :</h3>
          <ul className="text-left text-muted-foreground space-y-2">
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-primary" />
              Création de vos périodes
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-primary" />
              Création de vos matières
            </li>
            <li className="flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-primary" />
              Ajout de vos premières notes
            </li>
          </ul>
        </div>

        {/* Conditionally show the PWA install button if installable */}
        {canInstall && (
          <Button variant="default" onClick={handleInstallClick}>
            Installer l&apos;application
          </Button>
        )}
      </div>
    </div>
  );
}
