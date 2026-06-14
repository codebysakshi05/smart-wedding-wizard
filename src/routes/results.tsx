import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AppData, loadWeddingData } from "@/lib/weddingLoader";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Results from "@/pages/Results";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Wedding Plan — Smart Wedding Wizard" },
      {
        name: "description",
        content: "Explore your curated wedding events, outfits, decor and budget blueprint.",
      },
    ],
  }),
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        throw redirect({
          to: "/login",
          search: { redirect: location.href },
        });
      }
    }
  },
  component: ResultsPage,
});

function ResultsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const raw = sessionStorage.getItem("quiz_answers");
        const answers = raw ? JSON.parse(raw) : null;
        const data = await loadWeddingData(answers);
        if (!data) throw new Error("No plan data found.");
        setAppData(data);
      } catch (err) {
        toast.error("Could not load your plan.");
        navigate({ to: "/plan" });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [navigate]);

  if (loading || !appData || !user) {
    return (
      <Layout>
        <LoadingScreen message="Curating your cinematic wedding board..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Results appData={appData} />
    </Layout>
  );
}
