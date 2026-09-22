import { LucideIcon } from "lucide-react";

type Tone = "positive" | "negative" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  positive: "text-green-600 dark:text-green-400",
  negative: "text-red-600 dark:text-red-400",
  neutral: "text-slate-900 dark:text-slate-100",
};

export default function StatCard({
  label,
  value,
  tone = "neutral",
  icon: Icon,
  subtext,
}: {
  label: string;
  value: string;
  tone?: Tone;
  icon?: LucideIcon;
  subtext?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </div>
      <div className={`text-2xl font-bold ${TONE_CLASSES[tone]}`}>{value}</div>
      {subtext && (
        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtext}</div>
      )}
    </div>
  );
}
