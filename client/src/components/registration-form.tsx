import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RegistrationFormProps {
  onSuccess: (registrationId?: number) => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const { toast } = useToast();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      countryCode: "+1",
      agreedToTerms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      form.reset();
      onSuccess(data?.registration?.id);
      toast({
        title: "Registration Successful!",
        description: "You'll receive a confirmation email shortly.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-12 border border-white/20">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <Label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-3">
            Name*
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all duration-200"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="mt-2 text-red-500 text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>



<div>
  <Label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-3">
    Email*
  </Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email address"
    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all duration-200"
    {...form.register("email", {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    })}
  />
  {form.formState.errors.email && (
    <p className="mt-2 text-red-500 text-sm">{form.formState.errors.email.message}</p>
  )}
</div>




<div>
  <Label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-3">
    Phone Number*
  </Label>
  <div className="flex">
    {/* Country Code Input */}
    <Input
      id="countryCode"
      type="text"
      placeholder="+254"
      className="w-24 px-4 py-4 text-lg border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all duration-200"
      {...form.register("countryCode", {
        required: "Country code is required",
        pattern: {
          value: /^\+\d{1,4}$/,
          message: "Invalid country code format",
        },
      })}
    />

    {/* Phone Number Input */}
    <Input
      id="phone"
      type="tel"
      placeholder="Phone number"
      className="flex-1 px-6 py-4 text-lg border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all duration-200"
      {...form.register("phone", {
        required: "Phone number is required",
        pattern: {
          value: /^[0-9]{7,15}$/,
          message: "Invalid phone number",
        },
      })}
    />
  </div>

  {/* Validation Messages */}
  {form.formState.errors.countryCode && (
    <p className="mt-2 text-red-500 text-sm">{form.formState.errors.countryCode.message}</p>
  )}
  {form.formState.errors.phone && (
    <p className="mt-2 text-red-500 text-sm">{form.formState.errors.phone.message}</p>
  )}
</div>




        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={form.watch("agreedToTerms")}
            onCheckedChange={(checked) => form.setValue("agreedToTerms", checked as boolean)}
            className="mt-1"
          />
<Label htmlFor="terms" className="text-sm text-gray-600">
            By registering for the above, you confirm that you agree to the{" "}
            <a href="https://www.crispai.ca/terms" className="text-purple-600 hover:underline">Terms of Use</a> & the{" "}
            <a href="https://www.crispai.ca/privacy" className="text-purple-600 hover:underline">Privacy Policy</a> as well as receiving notification for future events. You can withdraw your consent at any time by unsubscribing.
          </Label>        </div>
        {form.formState.errors.agreedToTerms && (
          <p className="text-red-500 text-sm">{form.formState.errors.agreedToTerms.message}</p>
        )}

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full crisp-gradient text-white py-5 rounded-lg font-semibold text-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register now"
          )}
        </Button>
      </form>
    </div>
  );
}
