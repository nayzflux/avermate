import AvatarSection from "./avatar-section";
import EmailSection from "./email-section";
import NameSection from "./name-section";

export default function ProfilePage() {
  return (
    <main className="flex flex-col gap-8 w-full ">
      <AvatarSection />
      <NameSection />
      <EmailSection />
    </main>
  );
}
