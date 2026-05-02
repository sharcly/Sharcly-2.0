"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role must be at least 2 characters").max(100),
  company: z.string().max(100).nullable().default(""),
  message: z.string().min(10, "Message must be at least 10 characters"),
  rating: z.number().int().min(1).max(5).nullable().default(5),
  image: z.string().nullable().default(""),
  featured: z.boolean().default(false),
});

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company?: string | null;
  message: string;
  rating?: number | null;
  image?: string | null;
  featured: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  initialData?: Testimonial | null;
  onSubmit: (data: TestimonialFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function TestimonialForm({ initialData, onSubmit, isLoading, onCancel }: TestimonialFormProps) {
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: initialData?.name || "",
      role: initialData?.role || "Customer",
      company: initialData?.company || "",
      message: initialData?.message || "",
      rating: initialData?.rating ?? 5,
      image: initialData?.image || "",
      featured: initialData?.featured || false,
    },
  });

  const [rating, setRating] = useState(initialData?.rating || 5);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 pl-1">Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sarah M." {...field} className="rounded-xl border-black/[0.05] bg-gray-50/50 focus:bg-white transition-all h-12 px-4 text-xs font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 pl-1">Role / Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Customer" {...field} className="rounded-xl border-black/[0.05] bg-gray-50/50 focus:bg-white transition-all h-12 px-4 text-xs font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 pl-1">Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Austin, TX" {...field} value={field.value || ""} className="rounded-xl border-black/[0.05] bg-gray-50/50 focus:bg-white transition-all h-12 px-4 text-xs font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 pl-1">Star Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2 h-12 px-2 bg-gray-50/50 rounded-xl border border-black/[0.05]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          form.setValue("rating", star);
                        }}
                        className={cn(
                          "p-1 transition-all hover:scale-125 active:scale-90",
                          rating >= star ? "text-amber-400" : "text-gray-200"
                        )}
                      >
                        <Star className={cn("size-5", rating >= star ? "fill-current" : "fill-none")} />
                      </button>
                    ))}
                    <span className="ml-auto font-black text-[10px] text-muted-foreground opacity-40 pr-2">{rating}/5</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 pl-1">Testimonial Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the customer's testimonial..." 
                  className="min-h-[140px] rounded-[1.5rem] border-black/[0.05] bg-gray-50/50 focus:bg-white transition-all p-5 text-xs font-medium leading-relaxed resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 pl-1">Avatar Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value || ""} className="rounded-xl border-black/[0.05] bg-gray-50/50 focus:bg-white transition-all h-12 px-4 text-[10px] font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-xl border border-black/[0.05] bg-[#062D1B]/[0.02] p-3 h-12">
                <div className="space-y-0.5">
                  <FormLabel className="text-[7px] font-black uppercase tracking-widest text-[#062D1B]">Featured</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#062D1B] scale-75"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Form Footer - Styled like Roles Page */}
        <div className="-mx-8 -mb-10 mt-10 p-8 bg-gray-50/50 border-t border-black/[0.03]">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onCancel}
              className="h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest text-muted-foreground/30 hover:text-[#062D1B] px-8"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 h-12 rounded-2xl bg-[#062D1B] text-white hover:bg-[#083a23] shadow-xl shadow-[#062D1B]/10 font-black text-[10px] uppercase tracking-[0.3em] gap-3 group"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {initialData ? "Update Testimonial" : "Add Testimonial"}
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
