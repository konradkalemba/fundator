import { z } from "zod";

const baseCreateSponsorshipSchema = z.object({
  name: z.string().min(3).max(255),
  amount: z.coerce.number().min(1),
});

const createOneTimeSponsorshipSchema = z.object({
  type: z.literal("ONE_TIME"),
});

const createRecurringSponsorshipSchema = z.object({
  type: z.literal("RECURRING"),
  frequency: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
});

const conditionalCreateSponsorshipSchema = z.discriminatedUnion(
  "type",
  [createOneTimeSponsorshipSchema, createRecurringSponsorshipSchema],
  {
    errorMap: () => ({
      message: "Required",
    }),
  }
);

export const createSponsorshipSchema = z.intersection(
  baseCreateSponsorshipSchema,
  conditionalCreateSponsorshipSchema
);

export const fillSponsorshipRecipientSchema = z.object({
  login: z.string().min(1),
  amount: z.coerce.number().min(1),
});

export const fillSponsorshipSchema = z.object({
  recipients: z.array(fillSponsorshipRecipientSchema).min(1),
});
