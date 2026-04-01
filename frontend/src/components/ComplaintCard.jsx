import React from "react";
import { BadgeCheck, Clock } from "lucide-react";

function Pill({ children, variant="default" }){
  const styles = {
    default: "bg-white/10 text-slate-100",
    urgent: "bg-rose-500/15 text-rose-200 border border-rose-500/30",
    feedback: "bg-indigo-500/15 text-indigo-200 border border-indigo-500/30",
    suggestion: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/30",
  };
  return <span className={"px-2 py-1 rounded-full text-xs border border-white/10 "+styles[variant]}>{children}</span>
}

export default function ComplaintCard({ item }){
  const cat = (item.aiCategory || item.category || "feedback").toLowerCase();
  const status = item.status;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold">{item.title}</div>
          <div className="text-xs text-slate-400 mt-1">By: {item.createdBy?.name || "User"} • {new Date(item.createdAt).toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <Pill variant={cat}>{cat}</Pill>
          <Pill variant={status === "resolved" ? "suggestion" : "urgent"}>
            {status === "resolved" ? <span className="inline-flex items-center gap-1"><BadgeCheck size={14}/> Resolved</span> : <span className="inline-flex items-center gap-1"><Clock size={14}/> Pending</span>}
          </Pill>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-200 whitespace-pre-wrap">{item.description}</div>

      {item.aiSummary ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <div className="text-xs text-slate-400">AI Summary</div>
          <div className="text-sm mt-1 text-slate-200">{item.aiSummary}</div>
        </div>
      ) : null}
    </div>
  );
}
