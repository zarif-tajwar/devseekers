import Link from "next/link";

const RootPage = () => {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center h-svh">
      <h1 className="text-2xl font-bold tracking-tight">Root page</h1>
      <Link href={"/sign-in"} className="underline underline-offset-2">
        Go to sign in page
      </Link>
    </div>
  );
};

export default RootPage;
