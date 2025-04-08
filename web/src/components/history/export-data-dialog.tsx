"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Download } from "lucide-react";
import { getAvailableYears } from "@/lib/actions/export-data";

const formSchema = z.object({
  year: z.string(),
  type: z.enum(["gas", "electricity"]),
});

type ExportDataDialogProps = {
  onExport: (
    data: z.infer<typeof formSchema> & {
      userRole: "city" | "network";
      entityId: string;
    }
  ) => void;
  userRole: "city" | "network";
  entityId: string;
};

export function ExportDataDialog({
  onExport,
  userRole,
  entityId,
}: ExportDataDialogProps) {
  const [open, setOpen] = useState(false);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: "all",
      type: "electricity",
    },
  });

  useEffect(() => {
    async function fetchYears() {
      setIsLoading(true);
      try {
        const years = await getAvailableYears(userRole, entityId);
        setAvailableYears(years);
      } catch (error) {
        console.error("Failed to fetch available years:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (open) {
      fetchYears();
    }
  }, [open, userRole, entityId]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onExport({ ...values, userRole, entityId });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Energy Data</DialogTitle>
          <DialogDescription>
            Select the data you want to export as a CSV file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select energy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Export</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
