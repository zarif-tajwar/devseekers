import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <section className="flex justify-center items-center h-svh">
      {children}
    </section>
  );
};

export default AuthLayout;
