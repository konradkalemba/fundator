"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createSponsorship } from "@/lib/actions/sponsorships";
import { createSponsorshipSchema } from "@/lib/validations/sponsorships";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

type CreateSponsorshipFormProps = {
  organizationId: string;
};

export function CreateSponsorshipForm({
  organizationId,
}: CreateSponsorshipFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createSponsorshipSchema>>({
    resolver: zodResolver(createSponsorshipSchema),
    defaultValues: {
      name: "",
    },
  });

  const type = form.watch("type");

  function onSubmit(data: z.infer<typeof createSponsorshipSchema>) {
    startTransition(async () => {
      const sponsorship = await createSponsorship(organizationId, data);

      form.reset();
      router.push(
        `/organizations/${organizationId}/sponsorships/${sponsorship.id}`
      );
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-3 border shadow-sm bg-white border-gray-100 rounded-xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John's Sponsorship" {...field} />
              </FormControl>
              <FormDescription>This is for internal use only.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="100" {...field} />
              </FormControl>
              <FormDescription>
                In USD. This is amount that will be available for distribution
                among recipients
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ONE_TIME" />
                    </FormControl>
                    <FormLabel className="font-normal">One-time</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="RECURRING" />
                    </FormControl>
                    <FormLabel className="font-normal">Recurring</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === "RECURRING" && (
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MONTHLY" />
                    </FormControl>
                    <FormLabel className="font-normal">Monthly</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="QUARTERLY" />
                    </FormControl>
                    <FormLabel className="font-normal">Quarterly</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="YEARLY" />
                    </FormControl>
                    <FormLabel className="font-normal">Yearly</FormLabel>
                  </FormItem>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
