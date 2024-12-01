"use client";
import { UpdateEmailForm } from "@/components/forms/profile/update-email-form";
import { authClient } from "@/lib/auth";
import ProfileSection from "./profile-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormMessage, FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmailSection() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending
    // ||true
  ) {
    return (
      <Card className={"p-6 w-full"}>
        <div className="flex flex-col gap-6">
          <CardHeader className="p-0">
            <CardTitle>
              <Skeleton className="w-36 h-6" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-20 h-4" />
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {" "}
            <div>
                <form
                  className="flex flex-col gap-4"
                >
                <div className="w-full">
                  <Skeleton className="w-full h-10" />
                  </div>

                  <div className="flex w-full justify-end">
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isPending}
                    >
                      Save changes
                    </Button>
                  </div>
                </form>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <ProfileSection title="Your Email" description="Edit your email address.">
      {/* @ts-ignore */}
      <UpdateEmailForm defaultEmail={session?.user?.email} />
    </ProfileSection>
  );
}
