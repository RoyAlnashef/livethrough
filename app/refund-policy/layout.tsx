"use client";
import { Header } from '@/components/header';
import LiveThroughFooter from '@/components/LiveThroughFooter';

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <LiveThroughFooter />
    </div>
  );
} 