import dynamic from "next/dynamic";
import Spinner from "@repo/ui/components/core/spinner";
import { Metadata } from "next";
const SignUpForm = dynamic(() => import("../_components/SignUpForm"), {
  ssr: false,
  loading: () => <Spinner />,
});

export const metadata: Metadata = {
  title: "Sign Up for DevSeekers | Connect with Top Tech Talent",
  description:
    "Join DevSeekers to unlock exclusive tech opportunities, connect with industry-leading professionals, and grow your career in tech.",
};

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;
