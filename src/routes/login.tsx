import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: search.redirect as string | undefined,
    };
  },
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data.data.token, data.data.user);
      toast.success("Welcome back to Smart Wedding Wizard!");
      navigate({ to: search.redirect || "/plan" });
    } catch (err: any) {
      toast.error("Login failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-gold opacity-10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blush opacity-20 blur-[100px]" />
      </div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group">
        <div className="h-8 w-8 rounded-full bg-gradient-gold grid place-items-center shadow-glow group-hover:scale-110 transition-transform">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-xl leading-none">Smart Wedding Wizard</span>
      </Link>

      <div
        className="w-full max-w-md rounded-[2rem] shadow-luxury p-10 animate-fade-up"
        style={{
          background: "oklch(1 0 0 / 0.10)",
          border: "1px solid oklch(1 0 0 / 0.20)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl mb-2">Welcome Back</h1>
          <p className="text-white/75 text-sm">Log in to view and generate your plans.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[0.7rem] uppercase tracking-[0.2em] text-white/75 ml-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm text-white placeholder:text-white/40"
              style={{
                background: "oklch(0.24 0.02 65)",
                border: "1px solid oklch(0.38 0.025 70)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[0.7rem] uppercase tracking-[0.2em] text-white/75 ml-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm text-white placeholder:text-white/40"
              style={{
                background: "oklch(0.24 0.02 65)",
                border: "1px solid oklch(0.38 0.025 70)",
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative inline-flex items-center justify-center gap-3 rounded-full bg-gradient-gold px-8 py-4 text-[0.75rem] uppercase tracking-[0.24em] font-semibold text-primary-foreground shadow-luxury hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
          >
            <span className="relative">{isLoading ? "Logging in..." : "Log In"}</span>
            <ArrowRight className="relative h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
