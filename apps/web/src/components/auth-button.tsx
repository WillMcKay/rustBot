"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button className="h-11 rounded-full bg-black px-6 text-sm font-semibold text-white dark:bg-white dark:text-black">
        Loading...
      </button>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("steam")}
        className="h-11 rounded-full bg-[#171a21] px-6 text-sm font-semibold text-white hover:bg-[#1b2838]"
      >
        Sign in with Steam
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {session.user?.image ? (
        <img
          src={session.user.image}
          alt={session.user.name ?? "Steam avatar"}
          className="h-10 w-10 rounded-full"
        />
      ) : null}
      <div className="text-sm">
        <div className="font-semibold">{session.user?.name}</div>
        <button
          onClick={() => signOut()}
          className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
