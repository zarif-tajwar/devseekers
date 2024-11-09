import { auth } from "@/lib/server/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

const UsersPage = async () => {
  const user = await auth();

  if (!user) redirect("/sign-in");

  redirect(`/users/${user.id}`);

  return <div></div>;
};

export default UsersPage;
