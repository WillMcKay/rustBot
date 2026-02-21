import AuthButton from "@/components/auth-button";
import BotForm from "@/components/bot-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl bg-white p-12 shadow-sm dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Steam Authentication
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Sign in with your Steam account to continue.
          </p>
        </div>
        <AuthButton />
        <BotForm />
      </main>
    </div>
  );
}
