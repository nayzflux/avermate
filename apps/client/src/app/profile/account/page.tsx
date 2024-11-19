import LinkedAccount from "./linked-account";
import SessionList from "./session-list";

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <LinkedAccount />
      <SessionList />
    </div>
  );
}
