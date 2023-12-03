import { CreateSponsorshipForm } from "@/app/forms/create-sponsorship-form";

type NewProps = {
  params: {
    organizationId: string;
    sponsorshipId: string;
  };
};

export default function New({ params }: NewProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl">New sponsorship</h1>

      <CreateSponsorshipForm organizationId={params.organizationId} />
    </div>
  );
}
