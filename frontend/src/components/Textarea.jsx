import React from "react";

export default function Textarea({ label, ...props }){
  return (
    <label className="block">
      {label ? <div className="text-sm text-slate-300 mb-1">{label}</div> : null}
      <textarea
        {...props}
        className={"w-full min-h-[120px] rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60 "+(props.className||"")}
      />
    </label>
  );
}
