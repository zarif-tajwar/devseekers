import dynamic from "next/dynamic";
import Spinner from "@repo/ui/components/core/spinner";
import { Metadata } from "next";
const SignInForm = dynamic(() => import("../_components/SignInForm"), {
  ssr: false,
  loading: () => <Spinner />,
});

export const metadata: Metadata = {
  title: "Sign In to DevSeekers | Connect with Top Tech Talent",
  description:
    "Sign in to DevSeekers to access exclusive tech opportunities and connect with leading developers and companies. Join the platform that empowers tech talent to grow and succeed in today's dynamic industry.",
};

const SignInPage = () => {
  return <SignInForm />;
};

export default SignInPage;
