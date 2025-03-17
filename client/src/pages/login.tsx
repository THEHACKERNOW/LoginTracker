import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Mail as EnvelopeIcon, Lock as LockIcon } from "lucide-react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

// Define validation schema extending the insert schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize the form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Setup mutation for login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      const response = await apiRequest("POST", "/api/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
        variant: "default",
      });
      
      // Redirect to Google after a short delay
      setTimeout(() => {
        window.location.href = 'https://www.google.com';
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full overflow-hidden shadow-lg">
        {/* Header Section */}
        <div className="p-6 bg-primary text-white text-center">
          <h1 className="text-2xl font-medium">Welcome Back</h1>
          <p className="text-sm opacity-90 mt-1">Sign in to continue</p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 pr-3"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-destructive text-xs">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  {...form.register("rememberMe")}
                />
                <Label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </Label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-accent">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="outline" className="p-0 h-10">
                <FaGoogle className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="p-0 h-10">
                <FaFacebookF className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="p-0 h-10">
                <FaApple className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-primary hover:text-accent">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
