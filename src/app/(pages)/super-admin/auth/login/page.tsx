import { SuperAdminLoginForm } from "@/components/Forms/SuperAdminLoginForm";
import { TicketCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SuperAdminLogin = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-white dark:bg-gray-950">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-700 text-white">
              <TicketCheck className="size-4" />
            </div>
            Digievent
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SuperAdminLoginForm />
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Secure access for system administrators only
            </p>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10"></div>
        <Image
          src="/Placeholder/super-admin-login.jpg"
          width={1920}
          height={1080}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default SuperAdminLogin;
