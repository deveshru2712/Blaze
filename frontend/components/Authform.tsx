"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import Formfield from "./Formfield";
import { Button } from "./ui/button";
import Link from "next/link";

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
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-black/60 max-lg:max-w-[566px] px-8 py-6 border text-white/95 border-slate-100/30 shadow-lg rounded-md">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">
            {type == "sign-in"
              ? "Welcome Back to Blaze 🔥"
              : "Create an Account "}
          </h1>
          <span className="text-xl font-semibold">
            {type == "sign-in"
              ? "Your messages are waiting. Log in to see them! "
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
                className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-lg font-semibold cursor-pointer py-2 active:scale-105 duration-300 transition-all"
              >
                {type == "sign-in" ? "Sign in" : "Create an account"}
              </Button>
            </form>
          </Form>
          <p className="text-center text-lg mt-5">
            {type == "sign-in"
              ? "No account yet ?"
              : "Already have an account ?"}
            <Link
              href={type != "sign-in" ? "/sign-in" : "sign-up"}
              className="font-bold text-user-primary ml-1"
            >
              <span className="font-semibold hover:underline">
                {type != "sign-in" ? "Sign in" : "Sign up"}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authform;
