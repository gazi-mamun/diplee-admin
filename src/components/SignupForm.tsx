"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorOption, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";
import { jwtVerify } from "jose";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z
  .object({
    email: z.string().min(4).max(150).email(),
    password: z.string().min(8).max(32),
    confirmPassword: z.string().min(8).max(32),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const router = useRouter();
  const { setUser } = useGlobalContext();

  const [error, setError] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post<any>(
        `https://api.diplee.com/auth/local/signup`,
        values,
        { withCredentials: true }
      );
      const { payload } = await jwtVerify(
        res.data.access_token,
        new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
      );
      if (payload.role === "USER") {
        toast.error(
          "You are not eligible to access this panel. Please contact the admin"
        );
        await axios.get(`https://api.diplee.com/auth/logout`, {
          withCredentials: true,
        });
        return;
      }
      setUser({
        email: payload.email,
        userId: payload.userId,
        role: payload.role,
      });
      router.refresh();
      router.push("/products");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else {
        throw error;
      }
    }
  }

  const gotoSignin = () => {
    router.push("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <p className="text-center text-xs text-red-400 font-medium">{error}</p>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ConfirmPassword</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs">
          Already have an account?
          <span
            className="underline ml-1 text-blue-500 cursor-pointer"
            onClick={gotoSignin}
          >
            Signin
          </span>
        </p>

        <Button type="submit">Signup</Button>
      </form>
    </Form>
  );
}
