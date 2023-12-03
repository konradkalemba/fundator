import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type SponsorshipProps = {
  params: {
    organizationId: string;
    sponsorshipId: string;
  };
};

export default async function Sponsorship({ params }: SponsorshipProps) {
  const sponsorship = await prisma.sponsorship.findUnique({
    where: {
      id: params.sponsorshipId,
      organizationId: params.organizationId,
    },
    include: {
      recipients: true,
    },
  });

  if (!sponsorship) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <div className="text-xs uppercase font-medium text-gray-600">
          Sponsorships /
        </div>
        <h1 className="text-2xl">{sponsorship.name}</h1>
      </div>

      <div className="rounded-md border shadow-sm bg-white border-gray-100 p-3 flex flex-col gap-2">
        <p>
          Share this link with your employee of choice to allow them to fill out
          this sponsorship recipients. After they fill out the form, the system
          will automatically payout sponsorships among the recipients.
        </p>
        <div className="flex flex-col gap-1">
          <div className="font-medium text-sm text-[#636363]">Share link</div>
          <Input
            readOnly
            value={`${process.env.APP_URL}/sponsor/${sponsorship.updateToken}`}
          />
        </div>
      </div>
    </div>
  );
}
