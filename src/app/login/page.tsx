"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const name = form.get("name") as string;

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand"><span className="brand-mark">F</span><span>folkline</span></div>
        <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>
        <p className="login-sub">{mode === "login" ? "Welcome back to your pipeline." : "Start your free CRM workspace."}</p>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>Name<input name="name" required placeholder="Jamie Davis" /></label>
          )}
          <label>Email<input name="email" type="email" required placeholder="jamie@folkline.io" /></label>
          <label>Password<input name="password" type="password" required placeholder="••••••••" /></label>
          <button className="primary" type="submit" disabled={loading}>{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        <p className="switch-mode">
          {mode === "login" ? (
            <>No account? <button onClick={() => setMode("register")}>Create one</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("login")}>Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
