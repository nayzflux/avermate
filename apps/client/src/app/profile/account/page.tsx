import DeleteAccount from "./delete-account";
import LinkedAccount from "./linked-account";
import SessionList from "./session-list";

export default function AccountPage() {
  return (
    <main className="flex flex-col md:gap-8 gap-4 w-full ">
      <LinkedAccount />
      <SessionList />
      <DeleteAccount />
    </main>
  );
}
