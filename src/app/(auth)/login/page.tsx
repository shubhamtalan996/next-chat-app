import Image from "next/image";
import { PNG } from "@/assets";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            <Image
              width={200}
              referrerPolicy="no-referrer"
              className="rounded-full"
              src={PNG.darthLogo}
              alt="Your profile picture"
              priority
            />

            <p className="text-2xl font-semibold font-sans">
              Welcome to&nbsp;
              <span className="bg-gradient-to-r from-green-300 to-red-600">
                Darth&apos;s chat
              </span>
            </p>
            <p className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-90">
              Sign in to your account
            </p>
          </div>
          <LoginButton />
        </div>
      </div>
    </>
  );
};

export default Login;
