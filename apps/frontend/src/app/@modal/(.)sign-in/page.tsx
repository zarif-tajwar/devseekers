"use client";

import SignInForm from "@/app/(auth)/_components/SignInForm";
import { Dialog, DialogContent } from "@repo/ui/components/core/dialog";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const SignInPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const open = useMemo(() => pathname === "/sign-in", [pathname]);
  return (
    <Dialog open={open} onOpenChange={() => router.back()}>
      <DialogContent>
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
};

export default SignInPage;
