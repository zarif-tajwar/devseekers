import { env } from "@/env";
import { auth } from "@/lib/server/auth/auth";
import { Button } from "@repo/ui/components/core/button";
import Image from "next/image";

type PageProps = {
  params: { userId: string };
};

// (WIP)
// For now these are just temporary jsx for auth demonstration
const UserPage = async ({ params }: PageProps) => {
  const user = await auth();

  const isOwnUserPage = user && user.id === params.userId;

  return (
    <div className="max-w-lg mx-auto pt-60">
      {isOwnUserPage ? (
        <div>
          <div className="flex gap-4 mb-8">
            <div className="size-20 relative rounded-lg overflow-clip">
              {user.avatarUrl && (
                <Image src={user.avatarUrl} fill alt="user image" />
              )}
            </div>
            <div>
              <p className="font-bold text-neutral-800 text-lg">
                {user.fullname}
              </p>
              <p className="text-neutral-600 text-sm font-medium">
                {user.email}
              </p>
              <p className="text-neutral-500 text-sm font-medium">
                Roles: {user.roles?.join(", ")}
              </p>
            </div>
          </div>

          <Button asChild>
            <a
              href={`${env.NEXT_PUBLIC_BACKEND_URL}/auth/logout?redirect=true`}
            >
              Logout
            </a>
          </Button>
        </div>
      ) : (
        <div>{JSON.stringify(params)}</div>
      )}
    </div>
  );
};

export default UserPage;
