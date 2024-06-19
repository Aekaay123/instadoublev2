"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Signout = () => {
  const { data: session } = useSession();

  return (
    <div className="flex  space-x-2">
      
      <Image
        src={session?.user?.image}
        width={50}
        height={50}
        alt="profile"
        className="rounded-full"
      />
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-2xl font-semibold"
      >
        Signout
      </button>
    </div>
  );
};

export default Signout;
