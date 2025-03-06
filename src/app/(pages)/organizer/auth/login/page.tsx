import { OrganizerLoginForm } from "@/components/Forms/OrganizerLoginForm";
import { TicketCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const OrganizerLogin = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white">
              <TicketCheck className="size-4" />
            </div>
            Digievent
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <OrganizerLoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/Placeholder/organizer-login.jpg"
          width={1920}
          height={1080}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default OrganizerLogin;
