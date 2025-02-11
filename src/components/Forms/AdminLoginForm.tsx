"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Loading from "../Loading/Loading";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  _id: string;
  email: string;
  role: string;
  token: string;
}

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, user, isInitialized } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user) {
      router.replace("/admin/dashboard/overview");
    }
  }, [user, isInitialized, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      const payload = decodeJwt(data.token);
      if (!payload) {
        throw new Error("Invalid token format");
      }

      login(
        {
          id: data._id,
          email: data.email,
          role: data.role,
          accessToken: data.token,
          expiresIn: payload.exp * 1000, // Convert to milliseconds
        },
        rememberMe
      );
    },
    onError: (error: Error) => {
      alert(error.message || "Login failed. Please try again.");
    },
  });

  if (!isInitialized || user) {
    return <Loading />; // Show loading state while checking auth
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
    >
      {/* Rest of your form JSX remains the same */}
      <div className="grid gap-6">
        {/* Email input */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={cn(errors.email && "border-red-500")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password input */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be 8-12 characters",
                },
                maxLength: {
                  value: 12,
                  message: "Password must be 8-12 characters",
                },
              })}
              className={cn(errors.password && "border-red-500")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor="remember">Remember Me</Label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full hover:scale-105 transition-all duration-150 bg-blue-600 hover:bg-blue-800 text-white"
          disabled={!isValid || loginMutation.isPending}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
}
