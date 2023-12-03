import { FillSponsorshipForm } from "@/app/forms/fill-sponsorship-form";
import { Logo } from "@/components/logo";
import { prisma } from "@/lib/prisma";
import { SponsorshipType } from "@prisma/client";
import { notFound } from "next/navigation";

type SponsorProps = {
  params: {
    token: string;
  };
};

export default async function Sponsor({ params }: SponsorProps) {
  const sponsorship = await prisma.sponsorship.findUnique({
    where: {
      updateToken: params.token,
    },
    include: {
      organization: true,
    },
  });

  if (!sponsorship) {
    notFound();
  }

  return (
    <div className="container flex flex-col gap-4 pt-12">
      <Logo />

      <h1 className="text-2xl">You&apos;ve been assigned money to allocate</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 rounded-md border shadow-sm bg-white border-gray-100 p-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm text-[#636363]">Budget</div>
            <div className="flex items-baseline text-3xl text-green-700 gap-2">
              ${sponsorship.amount}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm text-[#636363]">Type</div>
            <div className="">{sponsorship.type.toLowerCase()}</div>
          </div>

          {sponsorship.type === SponsorshipType.RECURRING && (
            <div className="flex flex-col gap-1">
              <div className="font-medium text-sm text-[#636363]">
                Frequency
              </div>
              <div className="">{sponsorship.frequency!.toLowerCase()}</div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="font-medium text-sm text-[#636363]">
              Organization
            </div>
            <div className="">{sponsorship.organization.login}</div>
          </div>
        </div>
        <div className="col-span-3 rounded-md">
          <FillSponsorshipForm token={params.token} />
        </div>
      </div>
    </div>
  );
}
