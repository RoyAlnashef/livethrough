import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard | LiveThrough",
};

export default function DashboardPage() {
  redirect("/dashboard/courses");
  return null;
} 