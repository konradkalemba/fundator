"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fillSponsorship } from "@/lib/actions/sponsorships";
import { fillSponsorshipSchema } from "@/lib/validations/sponsorships";
import { RecipientsTable } from "@/components/recipients-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

type FillSponsorshipFormProps = {
  token: string;
};

export function FillSponsorshipForm({ token }: FillSponsorshipFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof fillSponsorshipSchema>>({
    resolver: zodResolver(fillSponsorshipSchema),
    defaultValues: {
      recipients: [{ login: "test", amount: 3 }],
    },
  });

  function onSubmit(data: z.infer<typeof fillSponsorshipSchema>) {
    startTransition(async () => {
      await fillSponsorship(token, data);

      form.reset();
      router.push(`/sponsor/${token}/success`);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <Alert variant="info">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            You can automatically fill the sponsorship based on the chosen
            GitHub repository.
            <Button
              variant="default"
              size="sm"
              className="bg-gray-900 self-end"
            >
              Choose repository
            </Button>
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="recipients"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RecipientsTable
                  data={field.value}
                  onChange={(data) => field.onChange(data)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex self-end items-center gap-2">
          <Button variant={"outline"}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
