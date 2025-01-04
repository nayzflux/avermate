import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Heading } from "../texts/heading";
import { SubHeading } from "../texts/subheading";
import { LandingSection } from "./landing-section";
import { useTranslations } from "next-intl";

export const Benefits = () => {
  const t = useTranslations("Landing.Benefits");

  const benefits = [
    t("easyToSetup"),
    t("fastAndSecure"),
    t("flexibleAndCustomizable"),
    t("goodUserExperience"),
  ];
  const cons = [t("hardToSetup"), t("badUserExperience"), t("lackOfFeatures")];

  return (
    <LandingSection>
      <div className="flex flex-col gap-4 items-center">
        <SubHeading className="max-w-[175px]" as="h3">
          {t("stayFocused")}
        </SubHeading>

        <Heading className="max-w-[250px] md:max-w-[500px]" as="h2">
          {t("simplifyResults")}
        </Heading>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-muted-foreground">
            {t("withoutAvermate")}
          </h4>

          <ul className="flex flex-col gap-2">
            {cons.map((con) => (
              <li className="flex items-center text-red-500" key={con}>
                <XMarkIcon className="size-4 mr-2" />
                {con}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-sm text-muted-foreground">{t("withAvermate")}</h4>

          <ul className="flex flex-col gap-2">
            {benefits.map((benefit) => (
              <li className="flex items-center text-emerald-500" key={benefit}>
                <CheckIcon className="size-4 mr-2" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LandingSection>
  );
};
