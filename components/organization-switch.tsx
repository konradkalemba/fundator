/* eslint-disable @next/next/no-img-element */
"use client";

import { Organization } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrganizationSwitchProps = {
  currentOrganizationId: string;
  organizations: Organization[];
};

export function OrganizationSwitch({
  currentOrganizationId,
  organizations,
}: OrganizationSwitchProps) {
  const router = useRouter();

  return (
    <Select
      value={currentOrganizationId}
      onValueChange={(organizationId) =>
        router.push(`/organizations/${organizationId}/sponsorships`)
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Switch organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            <div className="flex items-center gap-1">
              {organization.avatarUrl && (
                <img
                  src={organization.avatarUrl}
                  className="mr-2 h-4 w-4 rounded-sm"
                  alt={`${organization.login}'s avatar`}
                />
              )}
              {organization.login}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
