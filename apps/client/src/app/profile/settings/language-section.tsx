"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileSection from "../profile-section";
import { useTranslations } from "next-intl";

export const LanguageSection = () => {
  const t = useTranslations("Settings.Settings.Language");

  const router = useRouter();
  const pathname = usePathname();

  // We'll keep an internal state of the user's chosen language
  // so the Select shows the right value without waiting for SSR.
  const [language, setLanguage] = useState("system");

  // On mount, read the cookie and set initial state
  useEffect(() => {
    const cookieLocale = Cookies.get("locale");
    if (cookieLocale) {
      setLanguage(cookieLocale);
    } else {
      // If no cookie is set, the user is in "system" mode (auto-detect).
      setLanguage("system");
    }
  }, []);

  // Called when the user selects a language in the dropdown
  const changeLanguage = (lang: string) => {
    if (lang === "system") {
      // "System" => delete the cookie to let the server detect from headers
      Cookies.remove("locale");
    } else {
      // Otherwise store the chosen locale
      Cookies.set("locale", lang);
    }
    setLanguage(lang);

    // Force a server refresh so that next-intl picks up the new language
    // on the server side → no flicker
    router.refresh();
  };

  return (
    <ProfileSection title={t("title")} description={t("description")}>
      <div className="flex flex-col gap-4">
        <Label>{t("languageLabel")}</Label>

        <Select onValueChange={changeLanguage} value={language}>
          <SelectTrigger className="capitalize">
            <SelectValue placeholder={t("selectPlaceholder")} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="system">{t("system")}</SelectItem>
            <SelectItem value="en">{t("english")}</SelectItem>
            <SelectItem value="fr">{t("french")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ProfileSection>
  );
};
