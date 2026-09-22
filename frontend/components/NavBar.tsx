"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, PlusCircle, List, LayoutDashboard } from "lucide-react";

const LINKS = [
  { href: "/trades", label: "Log Trade", icon: PlusCircle },
  { href: "/trades/all", label: "All Trades", icon: List },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 mb-8">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
        <Link href="/trades" className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          LogRhythm
        </Link>
        <div className="flex items-center gap-1">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
