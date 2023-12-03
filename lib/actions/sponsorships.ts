"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createSponsorshipSchema,
  fillSponsorshipSchema,
} from "@/lib/validations/sponsorships";
import { randomBytes } from "crypto";

export async function createSponsorship(
  organizationId: string,
  data: z.infer<typeof createSponsorshipSchema>
) {
  const parsed = createSponsorshipSchema.parse(data);

  const sponsorship = await prisma.sponsorship.create({
    data: {
      ...parsed,
      updateToken: randomBytes(128).toString("base64url"),
      organizationId,
    },
  });

  return sponsorship;
}

export async function fillSponsorship(
  token: string,
  data: z.infer<typeof fillSponsorshipSchema>
) {
  const parsed = fillSponsorshipSchema.parse(data);

  const sponsorship = await prisma.sponsorship.findUnique({
    where: {
      updateToken: token,
    },
  });

  if (!sponsorship) {
    throw new Error("Sponsorship not found");
  }

  await prisma.sponsorship.update({
    where: {
      updateToken: token,
    },
    data: {
      recipients: {
        deleteMany: {},
        create: parsed.recipients,
      },
    },
  });

  return sponsorship;
}
