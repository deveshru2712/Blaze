"use client";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "./ui/form";
import { Button } from "./ui/button";
import Formfield from "./Formfield";

const authFormSchema = (type: FormType) => {
  return z.object({
    username: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const Authform = ({ type }: { type: FormType }) => {
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center px-6 text-white">
      <div className="relative group">
        {/* gradient div */}
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 opacity-50 blur-lg group-hover:opacity-60 transition-all duration-500" />

        <div className="relative bg-black lg:min-w-[566px] px-8 py-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold">
              {type == "sign-in" ? (
                <div className="flex items-center gap-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                    Welcome
                  </span>
                  Back to Blaze 🔥
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                    Create
                  </span>
                  an Account 🔥
                </div>
              )}
            </h1>
            <span className="text-xl font-semibold">
              {type == "sign-in"
                ? "Your messages are waiting. Log in to see them!"
                : "Sign up today, your messages are just a click away."}
            </span>
          </div>
          <div>
            <Form {...form}>
              <form className="w-full space-y-6 mt-4">
                {type == "sign-up" && (
                  <Formfield
                    control={form.control}
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="your name"
                  />
                )}

                <Formfield
                  control={form.control}
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                />

                <Formfield
                  control={form.control}
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-lg font-semibold cursor-pointer py-2 active:scale-105 duration-300 transition-all hover:shadow-lg hover:shadow-orange-400/30"
                >
                  {type == "sign-in" ? "Sign in" : "Create an account"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-slate-100/90 text-lg mt-5">
              {type == "sign-in"
                ? "No account yet?"
                : "Already have an account?"}
              <Link
                href={type != "sign-in" ? "/sign-in" : "sign-up"}
                className="ml-1"
              >
                <span className="text-white font-semibold hover:underline hover:text-orange-400 transition-colors">
                  {type != "sign-in" ? "Sign in" : "Sign up"}
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authform;
