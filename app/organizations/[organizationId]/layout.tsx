import { Logo } from "@/components/logo";
import { Combobox } from "@/components/ui/combobox";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganizationSwitch } from "@/components/organization-switch";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    organizationId: string;
  };
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const organizations = await prisma.organization.findMany({
    where: {
      ownerId: session.user.id,
    },
  });

  if (organizations.length === 0) {
    redirect("/onboarding");
  }

  if (
    !organizations.some(
      (organization) => organization.id === params.organizationId
    )
  ) {
    notFound();
  }

  return (
    <div className="container">
      <main className="flex flex-col col-span-3 gap-4">
        <div className="flex items-center gap-2 py-2 w-full">
          <Logo />
          <OrganizationSwitch
            currentOrganizationId={params.organizationId}
            organizations={organizations}
          />
          {/* <Link href={"/"}>Sponsorships</Link> */}
        </div>
        {/* <Logo /> */}
        {children}
      </main>
    </div>
  );
}
