"use client";

import { Slot } from "@radix-ui/react-slot";
import { Button, ButtonProps } from "@repo/ui/components/core/button";
import React from "react";
import { useLogout } from "../../lib/hooks/auth/UseLogout";

export interface LogoutButtonProps extends ButtonProps {
  asChild?: boolean;
}

const LogoutButton = React.forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ asChild, ...props }, ref) => {
    const { mutateAsync: handleLogout } = useLogout();
    const Comp = asChild ? Slot : Button;
    return <Comp onClick={() => handleLogout()} ref={ref} {...props} />;
  },
);

LogoutButton.displayName = "LogoutButton";

export default LogoutButton;
