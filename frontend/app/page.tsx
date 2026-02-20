import Image from "next/image";
import { TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">
              LogRhythm
            </h1>
          </div>
          <p className="text-muted-foreground">
            Track your trades, monitor performance, and improve your strategy
          </p>
        </div>
      </div>
    </div>
  );
}
