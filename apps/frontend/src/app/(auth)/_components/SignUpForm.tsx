"use client";
import { Button } from "@repo/ui/components/core/button";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuLoader2 } from "react-icons/lu";
import { useOAuthProvider } from "../_hooks/UseOAuthProvider";

const SignUpForm = () => {
  const {
    mutateAsync: registerWithGoogle,
    isPending: isGooglePending,
    isSuccess: isGoogleSuccess,
  } = useOAuthProvider({
    authMethod: "register",
    provider: "google",
    redirectUrl: "/users",
  });
  const {
    mutateAsync: registerWithGithub,
    isPending: isGithubPending,
    isSuccess: isGithubSuccess,
  } = useOAuthProvider({
    authMethod: "register",
    provider: "github",
    redirectUrl: "/users",
  });

  const disableEverything =
    isGooglePending || isGithubPending || isGoogleSuccess || isGithubSuccess;

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
          onClick={() => registerWithGithub()}
          disabled={disableEverything}
        >
          {isGithubPending || isGithubSuccess ? (
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
          onClick={() => registerWithGoogle()}
          disabled={isGooglePending}
        >
          {isGooglePending || isGoogleSuccess ? (
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
