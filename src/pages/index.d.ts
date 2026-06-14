// Type shims for JSX page components consumed by TSX route files
declare module "@/pages/Results" {
  import type { FC } from "react";
  const Results: FC<{ appData: any; onSavePlan?: () => void }>;
  export default Results;
}

declare module "@/pages/Dashboard" {
  import type { FC } from "react";
  const Dashboard: FC<{ user: any; logout: () => void }>;
  export default Dashboard;
}
