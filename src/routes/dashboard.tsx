import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Dashboard from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Wedding Suite — Smart Wedding Wizard" },
      {
        name: "description",
        content: "Manage your curated AI wedding plans, shortlisted venues, and inspiration board.",
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
  component: DashboardPage,
});

function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Layout>
      <Dashboard user={user} logout={logout} />
    </Layout>
  );
}
