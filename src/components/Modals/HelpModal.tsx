"use client";

import { Mail, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema with Zod
const formSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const HelpModal = ({ isOpen, onClose, userEmail }: HelpModalProps) => {
  const { toast } = useToast();

  // Initialize React Hook Form with Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
    mode: "onChange",
  });

  const { isValid, isSubmitting } = form.formState;

  const handleSendMessage = (values: FormValues) => {
    // Here you would implement the actual email sending logic
    console.log("Sending help request:", {
      ...values,
      from: userEmail,
    });

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the support team.",
      variant: "default",
    });

    form.reset();
    onClose();
  };

  // Add a proper cleanup function when the modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Small timeout to ensure state updates properly
      setTimeout(() => {
        onClose();
      }, 0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Contact Support
          </DialogTitle>
          <DialogDescription>
            Send a message to our support team. We&apos;ll get back to you as
            soon as possible.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="How can we help you?"
                      className="dark:bg-gray-800 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your issue in detail..."
                      className="min-h-[120px] dark:bg-gray-800 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="hover:scale-105 duration-150 transition-all h-11"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 duration-150 transition-all h-11"
                disabled={!isValid || isSubmitting}
              >
                <Send className="mr-1 h-4 w-4" /> Send Message
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
