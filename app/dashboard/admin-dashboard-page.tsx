"use client";

import { Breadcrumbs } from "@/components/dashboard/breadcrumbs";
import { BookOpen, Users, MapPin, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const stats = [
  {
    label: "Total Courses",
    value: "24",
    sub: "+2 from last month",
    icon: BookOpen,
  },
  {
    label: "Active Students",
    value: "1,247",
    sub: "+12% from last month",
    icon: Users,
  },
  {
    label: "Locations",
    value: "18",
    sub: "Across 12 states",
    icon: MapPin,
  },
  {
    label: "Revenue",
    value: "$89,432",
    sub: "+8% from last month",
    icon: BarChart3,
  },
];

const courses = [
  {
    name: "Wilderness Survival Basics",
    instructor: "John Smith",
    duration: "3 days",
    difficulty: "Beginner",
    price: "$299",
    status: "Active",
    enrolled: "24/30",
    location: "Rocky Mountains, CO",
  },
  {
    name: "Advanced Bushcraft Skills",
    instructor: "Sarah Johnson",
    duration: "5 days",
    difficulty: "Advanced",
    price: "$599",
    status: "Active",
    enrolled: "18/20",
    location: "Appalachian Trail, VA",
  },
  {
    name: "Urban Emergency Preparedness",
    instructor: "Mike Davis",
    duration: "2 days",
    difficulty: "Intermediate",
    price: "$199",
    status: "Draft",
    enrolled: "0/25",
    location: "Seattle, WA",
  },
  {
    name: "Winter Survival Intensive",
    instructor: "Emma Wilson",
    duration: "4 days",
    difficulty: "Expert",
    price: "$799",
    status: "Active",
    enrolled: "12/15",
    location: "Alaska Wilderness",
  },
  {
    name: "Fire Making Mastery",
    instructor: "Tom Brown",
    duration: "1 day",
    difficulty: "Beginner",
    price: "$99",
    status: "Active",
    enrolled: "35/40",
    location: "Yellowstone, WY",
  },
];

function DifficultyBadge({ level }: { level: string }) {
  const color =
    level === "Beginner"
      ? "bg-green-900 text-green-400"
      : level === "Intermediate"
      ? "bg-yellow-900 text-yellow-400"
      : level === "Advanced"
      ? "bg-orange-900 text-orange-400"
      : "bg-red-900 text-red-400";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{level}</span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active"
      ? "bg-green-900 text-green-400"
      : status === "Draft"
      ? "bg-zinc-800 text-zinc-400"
      : "bg-zinc-700 text-zinc-300";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>{status}</span>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 p-8">
      <Breadcrumbs
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Courses" },
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900 rounded-xl p-5 flex flex-col gap-2 border border-zinc-800 relative"
          >
            <stat.icon className="absolute right-4 top-4 w-6 h-6 text-zinc-700" />
            <div className="text-zinc-400 text-xs font-medium">{stat.label}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.sub}</div>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 mt-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Course Management</h2>
            <p className="text-zinc-400 text-sm">
              Manage all survival courses offered through LiveThrough
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              placeholder="Search courses..."
              className="bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-500"
            />
            <Button
              className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-4 py-2 rounded-sm"
              onClick={() => router.push("/dashboard/courses/add")}
            >
              + Add Course
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-2 px-3 text-left font-semibold">Course</th>
                <th className="py-2 px-3 text-left font-semibold">Instructor</th>
                <th className="py-2 px-3 text-left font-semibold">Duration</th>
                <th className="py-2 px-3 text-left font-semibold">Difficulty</th>
                <th className="py-2 px-3 text-left font-semibold">Price</th>
                <th className="py-2 px-3 text-left font-semibold">Status</th>
                <th className="py-2 px-3 text-left font-semibold">Enrolled</th>
                <th className="py-2 px-3 text-left font-semibold">Location</th>
                <th className="py-2 px-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.name}
                  className="border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="py-2 px-3 font-medium text-white whitespace-nowrap">
                    {course.name}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{course.instructor}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{course.duration}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <DifficultyBadge level={course.difficulty} />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{course.price}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <StatusBadge status={course.status} />
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{course.enrolled}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{course.location}</td>
                  <td className="py-2 px-3 whitespace-nowrap text-right">
                    <button className="text-zinc-400 hover:text-zinc-200">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 