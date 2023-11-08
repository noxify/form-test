"use client";
//import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TagInput from "@/components/ui/tag-input";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),

  taginput: z.array(z.string()).min(1),
  selectfield: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),

  language: z.string({
    required_error: "Please select a language.",
  }),
  security_emails: z.literal<boolean>(true),
});

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export function InputForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      selectfield: "",
      taginput: ["a", "b", "c"],
      security_emails: false,
    },
    mode: "all",
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="my-4 text-lg font-medium">Text Inputs</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                warn={(value: string) =>
                  value == "test" ? "not the best username" : false
                }
                render={({ field, warning }) => {
                  return (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl warning={warning}>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name. Try "test" to get a
                        warning.
                      </FormDescription>
                      <FormMessage warning={warning} />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="bio"
                // warn={(value: string) =>
                //   value == "lorem ipsum" && "this is not allowed"
                // }
                render={({ field, warning }) => (
                  <FormItem>
                    <FormLabel>Textarea</FormLabel>
                    <FormControl warning={warning}>
                      <Textarea placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage warning={warning} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taginput"
                render={({ field, warning }) => (
                  <FormItem>
                    <FormLabel>Taginput</FormLabel>
                    <FormControl warning={warning}>
                      <TagInput
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Press Enter to add a new tag
                    </FormDescription>
                    <FormMessage warning={warning} />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="my-4 text-lg font-medium">Selects </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="selectfield"
                // warn={(value: string) =>
                //   value == "m@example.com" && "This email is deprecated"
                // }
                render={({ field, warning }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl warning={warning} hideIcon={true}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                        <SelectItem value="m@google.com">
                          m@google.com
                        </SelectItem>
                        <SelectItem value="m@support.com">
                          m@support.com
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can manage email addresses in your{" "}
                    </FormDescription>
                    <FormMessage warning={warning} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                // warn={(value: string) => {
                //   return value == "ru" && "Are you sure?";
                // }}
                render={({ field, warning, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Language (
                      <Button
                        variant={"link"}
                        className="px-1 text-xs"
                        onClick={() => form.resetField(field.name)}
                      >
                        Clear
                      </Button>
                      )
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl warning={warning} hideIcon={true}>
                          <Button
                            variant="form"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",

                              fieldState.error && "text-red-500"
                            )}
                          >
                            {field.value
                              ? languages.find(
                                  (language) => language.value === field.value
                                )?.label
                              : "Select language"}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput placeholder="Search language..." />
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.clearErrors(field.name);
                                  form.setValue(field.name, language.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {language.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This is the language that will be used in the dashboard.
                    </FormDescription>
                    <FormMessage warning={warning} />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="my-4 text-lg font-medium">Checks </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="security_emails"
                render={({ field, warning }) => (
                  <>
                    <FormItem className="flex flex-col rounded-lg border p-4">
                      <div className="flex flex-row items-center justify-between ">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Security emails
                          </FormLabel>
                          <FormDescription>
                            Receive emails about your account security.
                          </FormDescription>
                        </div>
                        <FormControl warning={warning} hideIcon={true}>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-readonly
                          />
                        </FormControl>
                      </div>
                      <div className="flex flex-col w-full">
                        <FormMessage warning={warning} />
                      </div>
                    </FormItem>
                  </>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
      {/* <DevTool control={form.control} /> set up the dev tool */}
    </>
  );
}
