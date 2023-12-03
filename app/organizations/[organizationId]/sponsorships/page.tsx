import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type SponsorshipsProps = {
  params: {
    organizationId: string;
  };
};

export default async function Sponsorships({ params }: SponsorshipsProps) {
  const sponsorships = await prisma.sponsorship.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Sponsorships</h1>

      <Link href={`/organizations/${params.organizationId}/sponsorships/new`}>
        <Button>Create sponsorship</Button>
      </Link>
      <div className="grid grid-cols-4 gap-4">
        {sponsorships.map((sponsorship) => (
          <Link
            key={sponsorship.id}
            href={`/organizations/${params.organizationId}/sponsorships/${sponsorship.id}`}
          >
            <div className="rounded border shadow-sm border-gray-100 p-2">
              <h3 className="text-lg text-purple-600 mb-3">
                {sponsorship.name}
              </h3>

              <div className="flex flex-col gap-1">
                <div className="font-medium text-sm text-[#636363]">Status</div>
                <div className="">Active</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
