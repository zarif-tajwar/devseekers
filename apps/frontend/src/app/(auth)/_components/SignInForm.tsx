"use client";
import { Button } from "@repo/ui/components/core/button";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LuLoader2 } from "react-icons/lu";
import { useOAuthProvider } from "../_hooks/UseOAuthProvider";

const SignInForm = () => {
  const {
    mutateAsync: loginWithGoogle,
    isPending: isGooglePending,
    isSuccess: isGoogleSuccess,
  } = useOAuthProvider({
    authMethod: "login",
    provider: "google",
    redirectUrl: "/users",
  });
  const {
    mutateAsync: loginWithGithub,
    isPending: isGithubPending,
    isSuccess: isGithubSuccess,
  } = useOAuthProvider({
    authMethod: "login",
    provider: "github",
    redirectUrl: "/users",
  });

  const disableEverything =
    isGooglePending || isGithubPending || isGoogleSuccess || isGithubSuccess;

  return (
    <div className="mx-auto sm:max-w-md  flex w-full flex-col justify-center space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-center">
        Sign In to DevSeekers
      </h1>

      <div className="flex flex-col gap-4 py-4">
        <Button
          type="button"
          variant={"outline"}
          className="w-full flex items-center gap-2 "
          onClick={() => loginWithGithub()}
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
          onClick={() => loginWithGoogle()}
          disabled={disableEverything}
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
        Don&apos;t have an account?{" "}
        <Link
          href={"/sign-up"}
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
