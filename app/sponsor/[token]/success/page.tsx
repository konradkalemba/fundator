import { Logo } from "@/components/logo";

export default function Success() {
  return (
    <div className="container flex flex-col gap-4 pt-12">
      <Logo />

      <h1 className="text-2xl">All set!</h1>

      <p>The selected recipients will receive money soon.</p>
    </div>
  );
}
