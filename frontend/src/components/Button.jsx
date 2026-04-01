import React from "react";

export default function Button({ variant="primary", ...props }){
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 font-semibold transition active:scale-[0.98] disabled:opacity-50";
  const styles = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white shadow-glass",
    secondary: "bg-white/10 hover:bg-white/15 border border-white/10",
    ghost: "hover:bg-white/10",
    danger: "bg-rose-500 hover:bg-rose-400 text-white",
  };
  return <button {...props} className={base+" "+styles[variant]+" "+(props.className||"")} />;
}
