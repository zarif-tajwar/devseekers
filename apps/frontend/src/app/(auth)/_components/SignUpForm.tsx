"use client";
import { Button } from "@repo/ui/components/core/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "@repo/ui/components/core/sonner";
import { useState } from "react";
import { LuLoader2 } from "react-icons/lu";

const SignUpForm = () => {
  const [state, setState] = useState({
    type: "",
    loading: false,
  });

  const handleSocialLogin = useCallback(async (type: "github" | "google") => {
    setState({ type, loading: true });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setState({ type: "", loading: false });
    toast("Sign in successful", {
      icon: "🎉",
      duration: 3000,
    });
  }, []);

  return (
    <div className="mx-auto sm:max-w-md  flex w-full flex-col justify-center space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-center">
        Join DevSeekers
      </h1>

      <div className="flex flex-col gap-4 py-4">
        <Button
          type="button"
          variant={"outline"}
          className="w-full flex items-center gap-2 "
          onClick={() => handleSocialLogin("github")}
          disabled={
            (state.type === "github" || state.type === "google") &&
            state.loading
          }
        >
          {state.type === "github" && state.loading ? (
            <LuLoader2 size={40} className="animate-spin" />
          ) : (
            <FaGithub />
          )}
          <span>Continue with Github</span>
        </Button>
        <Button
          type="button"
          variant={"outline"}
          className="w-full flex items-center gap-2 "
          onClick={() => handleSocialLogin("google")}
          disabled={
            (state.type === "github" || state.type === "google") &&
            state.loading
          }
        >
          {state.type === "google" && state.loading ? (
            <LuLoader2 size={40} className="animate-spin" />
          ) : (
            <FaGoogle />
          )}
          <span>Continue with Google</span>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={"/sign-in"}
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
