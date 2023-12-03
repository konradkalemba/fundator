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
import { finishOnboardingSchema } from "@/lib/validations/onboarding";
import { finishOnboarding } from "@/lib/actions/onboarding";
import { Combobox } from "@/components/ui/combobox";

type FinishOnboardingFormProps = {
  githubOrganizations: any[];
};

export function FinishOnboardingForm({
  githubOrganizations,
}: FinishOnboardingFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof finishOnboardingSchema>>({
    resolver: zodResolver(finishOnboardingSchema),
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof finishOnboardingSchema>) {
    startTransition(async () => {
      await finishOnboarding(data);

      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="githubLogin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Combobox
                  options={githubOrganizations.map((githubOrganization) => ({
                    value: githubOrganization.login,
                    label: githubOrganization.login,
                    avatar: githubOrganization.avatar_url,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex self-end items-center gap-2">
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
