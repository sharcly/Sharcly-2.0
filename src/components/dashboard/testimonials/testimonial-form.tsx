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
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().min(2, "Role must be at least 2 characters").max(100),
  company: z.string().max(100).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  rating: z.number().int().min(1).max(5).optional().nullable().default(5),
  image: z.string().url().optional().nullable().or(z.string().length(0)),
  featured: z.boolean().default(false),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  initialData?: any;
  onSubmit: (data: TestimonialFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function TestimonialForm({ initialData, onSubmit, isLoading }: TestimonialFormProps) {
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData || {
      name: "",
      role: "Customer",
      company: "",
      message: "",
      rating: 5,
      image: "",
      featured: false,
    },
  });

  const [rating, setRating] = useState(initialData?.rating || 5);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Sarah M." {...field} className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-11 px-4 font-medium" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role / Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Customer" {...field} className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-11 px-4 font-medium" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location / Company (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Austin, TX" {...field} value={field.value || ""} className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-11 px-4 font-medium" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Star Rating</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1.5 h-11 px-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setRating(star);
                          form.setValue("rating", star);
                        }}
                        className={cn(
                          "p-1.5 rounded-lg transition-all hover:scale-110 active:scale-90",
                          rating >= star ? "text-amber-400" : "text-gray-200"
                        )}
                      >
                        <Star className={cn("size-6", rating >= star ? "fill-current" : "fill-none")} />
                      </button>
                    ))}
                    <span className="ml-3 font-black text-sm text-muted-foreground">{rating}/5</span>
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
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">The Testimonial Narrative</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share the customer experience..." 
                  className="min-h-[120px] rounded-[1.5rem] border-gray-100 bg-white/50 focus:bg-white transition-all p-5 font-medium leading-relaxed resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Avatar Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} value={field.value || ""} className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-11 px-4 font-medium" />
              </FormControl>
              <FormDescription className="text-[10px] italic opacity-60">Leave empty for a placeholder avatar based on the name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-6 bg-[#062D1B]/[0.02] border border-[#062D1B]/5 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#062D1B]">Highlight as Featured</h4>
            <p className="text-[10px] text-muted-foreground italic">Featured testimonials appear prominently on the homepage.</p>
          </div>
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#062D1B]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-[#062D1B] hover:bg-[#083a23] text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-[#062D1B]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isLoading ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : null}
          {initialData ? "Update Testimonial Authority" : "Execute Testimonial Creation"}
        </Button>
      </form>
    </Form>
  );
}
