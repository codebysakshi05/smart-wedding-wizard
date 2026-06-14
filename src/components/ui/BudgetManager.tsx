import React, { useState, useEffect } from "react";
import { Wallet, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

export default function BudgetManager({ totalBudget = 1500000, themeAccents }) {
  const [allocations, setAllocations] = useState({
    venue: { label: "Venue & Catering", percent: 45, spent: 0 },
    decor: { label: "Decor & Lighting", percent: 15, spent: 0 },
    photo: { label: "Photography", percent: 12, spent: 0 },
    outfits: { label: "Outfits & Makeup", percent: 15, spent: 0 },
    misc: { label: "Misc & Buffer", percent: 13, spent: 0 },
  });

  // Calculate actual amounts based on budget
  const data = Object.entries(allocations).map(([key, val]) => {
    const allocatedAmount = (totalBudget * val.percent) / 100;
    return { ...val, key, allocatedAmount };
  });

  const inr = (n) => "₹" + (n || 0).toLocaleString("en-IN");

  return (
    <div className="glass rounded-[2.5rem] p-8 border border-white/10 bg-black/40 space-y-8 flex flex-col justify-between">
      <div className="space-y-2 border-b border-white/5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className={`w-6 h-6 ${themeAccents?.accentText || "text-primary"}`} />
            <h3 className="font-display text-2xl text-white">Budget Manager</h3>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[0.65rem] uppercase tracking-widest font-bold text-emerald-400">
              On Track
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-serif italic">
          Intelligent breakdown of your {inr(totalBudget)} wedding cap.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-neutral-400 font-bold mb-1">
              Total Cap
            </p>
            <p className="font-display text-4xl text-white tracking-tight">{inr(totalBudget)}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] uppercase tracking-widest text-neutral-400 font-bold mb-1">
              Allocated
            </p>
            <p className="text-lg font-bold text-white">100%</p>
          </div>
        </div>

        {/* Custom Progress Bar Segmented */}
        <div className="h-4 w-full bg-neutral-900 rounded-full flex overflow-hidden border border-white/10">
          <div
            className="h-full bg-amber-500 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ width: "45%" }}
            title="Venue: 45%"
          />
          <div
            className="h-full bg-emerald-500 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ width: "15%" }}
            title="Decor: 15%"
          />
          <div
            className="h-full bg-sky-500 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ width: "12%" }}
            title="Photo: 12%"
          />
          <div
            className="h-full bg-rose-500 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ width: "15%" }}
            title="Outfits: 15%"
          />
          <div
            className="h-full bg-neutral-600 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ width: "13%" }}
            title="Misc: 13%"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-4">
          {data.map((item, idx) => {
            const colors = [
              "bg-amber-500",
              "bg-emerald-500",
              "bg-sky-500",
              "bg-rose-500",
              "bg-neutral-600",
            ];
            return (
              <div
                key={item.key}
                className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors[idx]}`} />
                  <span className="text-xs text-white/90 font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">{inr(item.allocatedAmount)}</p>
                  <p className="text-[0.55rem] text-neutral-500">{item.percent}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-serif italic">
        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Your venue budget is optimized for luxury palaces based on your selected aesthetic.
          Adjustments will automatically cascade.
        </p>
      </div>
    </div>
  );
}
