import AvatarSection from "./avatar-section";
import EmailSection from "./email-section";
import NameSection from "./name-section";

export default function ProfilePage() {
  return (
    <main className="flex flex-col md:gap-8 gap-4 w-full ">
      <AvatarSection />
      <NameSection />
      <EmailSection />
    </main>
  );
}
