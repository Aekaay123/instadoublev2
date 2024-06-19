"use client"
import React from "react";
import { signIn } from "next-auth/react";

const Signin = () => {
  return (
    <>
      <button
        onClick={() => signIn("google",{callbackUrl: "/dashboard"})}
        className="text-2xl font-semibold"
      >
        Sign in
      </button>
    </>
  );
};

export default Signin;
