import { HTTPError } from "ky";

const errorMessages: Record<number, string> = {
  401: "Vous n'êtes pas autorisé à effectuer cette action. Veuillez réessayer plus tard.",
  403: "Vous n'êtes pas autorisé à effectuer cette action. Veuillez réessayer plus tard.",
  404: "La ressource demandée est introuvable. Veuillez réessayer plus tard.",
  500: "Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.",
  429: "Trop de requêtes. Veuillez réessayer plus tard.",
  503: "Le serveur est indisponible. Veuillez réessayer plus tard.",
  400: "Une erreur s'est produite. Veuillez réessayer plus tard.",
};

export function handleError(
  error: unknown,
  toaster: ReturnType<typeof import("@/hooks/use-toast").useToast>
) {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    const message =
      errorMessages[status] || "Une erreur inconnue s'est produite.";

    toaster.toast({
      title: "Erreur",
      description: `${message} (${status})`,
      variant: "destructive",
    });
  } else {
    toaster.toast({
      title: "Erreur",
      description: `Une erreur inattendue s'est produite. Veuillez réessayer plus tard. (${error})`,
      variant: "destructive",
    });
  }
}
