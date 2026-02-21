"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function BotForm() {
  const { data: session, status } = useSession();
  const [server, setServer] = useState("");
  const [port, setPort] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [playerToken, setPlayerToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [botStatus, setBotStatus] = useState<
    "idle" | "loading" | "running" | "none" | "error"
  >("idle");
  const [botInfo, setBotInfo] = useState<
    { server: string; port: number; playerId: string } | null
  >(null);
  const [botStatusMessage, setBotStatusMessage] = useState<string | null>(null);

  const isAuthed = status === "authenticated";

  useEffect(() => {
    if (!isAuthed) {
      setBotStatus("idle");
      setBotInfo(null);
      setBotStatusMessage(null);
      return;
    }

    let isCancelled = false;

    const loadBotStatus = async () => {
      setBotStatus("loading");
      setBotStatusMessage(null);

      try {
        const response = await fetch("/api/bots");
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (!isCancelled) {
            setBotStatus("error");
            setBotStatusMessage(data?.error ?? "Failed to load bot status.");
          }
          return;
        }

        if (!isCancelled) {
          if (data?.exists) {
            setBotInfo(data?.bot ?? null);
            setBotStatus("running");
          } else {
            setBotInfo(null);
            setBotStatus("none");
          }
        }
      } catch (error) {
        if (!isCancelled) {
          setBotStatus("error");
          setBotStatusMessage("Failed to load bot status.");
        }
      }
    };

    loadBotStatus();

    return () => {
      isCancelled = true;
    };
  }, [isAuthed]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          server,
          port: Number(port),
          playerId,
          playerToken,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data?.error ?? "Failed to create bot");
        return;
      }

      setMessage("Bot created successfully.");
      setBotInfo({
        server,
        port: Number(port),
        playerId,
      });
      setBotStatus("running");
    } catch (error) {
      setMessage("Failed to create bot.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (status === "loading") {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Loading session...
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Sign in to create your bot.
      </div>
    );
  }

  if (botStatus === "loading") {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Checking bot status...
      </div>
    );
  }

  if (botStatus === "error") {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        {botStatusMessage ?? "Failed to load bot status."}
      </div>
    );
  }

  if (botStatus === "running") {
    return (
      <div className="w-full max-w-xl space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
        <div className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Bot running
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your bot is already running. You can only run one bot per account.
        </p>
        {botInfo ? (
          <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <div>Server: {botInfo.server}</div>
            <div>Port: {botInfo.port}</div>
            <div>Player ID: {botInfo.playerId}</div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-4 text-left"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Server IP / Host
          <input
            value={server}
            onChange={(event) => setServer(event.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="127.0.0.1"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          App Port
          <input
            value={port}
            onChange={(event) => setPort(event.target.value)}
            className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="28082"
            required
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Player ID (SteamID)
        <input
          value={playerId}
          onChange={(event) => setPlayerId(event.target.value)}
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          required
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Player Token
        <input
          value={playerToken}
          onChange={(event) => setPlayerToken(event.target.value)}
          className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          required
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-full bg-[#171a21] px-6 text-sm font-semibold text-white hover:bg-[#1b2838] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Creating..." : "Create bot"}
      </button>
      {message ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{message}</p>
      ) : null}
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Each Steam account can create one bot.
      </p>
    </form>
  );
}
