"use client";

import { Label } from "@/components/ui/label";
import ProfileSection from "../profile-section";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import DeletePeriodDialog from "@/components/dialogs/delete-period-dialog";
import UpdatePeriodDialog from "@/components/dialogs/update-period-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import errorStateCard from "@/components/skeleton/error-card";
import { ArrowRightIcon, BookOpenIcon, PlusCircleIcon } from "lucide-react";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import Link from "next/link";

export const OnboardingSection = () => {
  //Fetch period data

  return (
      <ProfileSection title="Mise en route" description="Accéder à la page de mise en route">
          <Link href={"/onboarding"}><Button>Commencer<ArrowRightIcon/></Button></Link>
    </ProfileSection>
  );
};
