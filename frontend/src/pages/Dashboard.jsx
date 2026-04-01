import React, { useEffect, useMemo, useState } from "react";
import { Send, Search, Sparkles, LogOut, LayoutDashboard, Wand2, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { clearToken, getUser } from "../lib/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Toast from "../components/Toast";
import ComplaintCard from "../components/ComplaintCard";

function GlassBG(){
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute top-40 -right-24 h-[360px] w-[360px] rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  )
}

function Modal({ open, title, children, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const notify = (title, message="") => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 3200);
  };

  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if(!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(x =>
      x.title.toLowerCase().includes(q) ||
      x.description.toLowerCase().includes(q) ||
      (x.aiCategory || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const fetchItems = async () => {
    try{
      setLoading(true);
      const res = await api.get("/complaints");
      setItems(res.data);
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const logout = async () => {
    try{ await api.post("/auth/logout", {}); }catch{}
    clearToken();
    window.location.href = "/login";
  };

  // Submit complaint
  const [openSubmit, setOpenSubmit] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", category:"feedback" });

  const submit = async (e) => {
    e.preventDefault();
    try{
      await api.post("/complaints", {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category
      });
      setOpenSubmit(false);
      setForm({ title:"", description:"", category:"feedback" });
      notify("Submitted", "Your complaint/feedback was submitted.");
      fetchItems();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const aiSummarize = async (id) => {
    try{
      notify("AI Running...", "Groq is summarizing and classifying.");
      await api.post(`/complaints/${id}/ai-summarize`, {});
      fetchItems();
      notify("Done", "AI summary generated.");
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try{
      await api.put(`/complaints/${id}/status`, { status });
      fetchItems();
      notify("Updated", "Status updated.");
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  // Stats for admin
  const stats = useMemo(() => {
    const total = items.length;
    const resolved = items.filter(x => x.status === "resolved").length;
    const pending = total - resolved;
    return { total, resolved, pending };
  }, [items]);

  return (
    <div className="min-h-screen">
      <GlassBG />

      <div className="relative max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                <Sparkles size={16} />
                Complaint / Feedback System
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
                Secure Complaints Portal
              </h1>
              <p className="text-slate-300 mt-2">
                Logged in as <span className="font-semibold">{user?.name}</span> ({user?.role})
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setOpenSubmit(true)}><Send size={18}/> Submit</Button>
              <Button variant="secondary" onClick={logout}><LogOut size={18}/> Logout</Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaints..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 flex items-center gap-2">
              <LayoutDashboard size={18} className="text-indigo-300" />
              <span className="text-sm text-slate-200">AI Summary + Classification</span>
            </div>
          </div>
        </div>

        {/* Admin analytics */}
        {isAdmin ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-5">
              <div className="text-sm text-slate-300">Total</div>
              <div className="text-3xl font-bold mt-2">{stats.total}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-5">
              <div className="text-sm text-slate-300">Pending</div>
              <div className="text-3xl font-bold mt-2">{stats.pending}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-5">
              <div className="text-sm text-slate-300">Resolved</div>
              <div className="text-3xl font-bold mt-2">{stats.resolved}</div>
            </div>
          </div>
        ) : null}

        {/* List */}
        <div className="mt-6 grid gap-4">
          {loading ? <div className="text-slate-300">Loading…</div> : null}
          {filtered.length === 0 ? <div className="text-slate-400">No complaints yet.</div> : null}

          {filtered.map(item => (
            <div key={item._id}>
              <ComplaintCard item={item} />
              {isAdmin ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button variant="secondary" onClick={() => aiSummarize(item._id)}><Wand2 size={16}/> AI Summarize</Button>
                  {item.status !== "resolved" ? (
                    <Button variant="primary" onClick={() => updateStatus(item._id, "resolved")}><CheckCircle2 size={16}/> Mark Resolved</Button>
                  ) : (
                    <Button variant="secondary" onClick={() => updateStatus(item._id, "pending")}>Mark Pending</Button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-slate-500 mt-10">
          RBAC: Admin can manage + AI summarize. User can submit/view only.
        </div>
      </div>

      {/* Submit modal */}
      <Modal open={openSubmit} title="Submit Complaint / Feedback" onClose={() => setOpenSubmit(false)}>
        <form onSubmit={submit} className="grid gap-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm(f => ({...f, title: e.target.value}))} />
          <Textarea label="Description" required value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} />
          <label className="block">
            <div className="text-sm text-slate-300 mb-1">Category (manual)</div>
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({...f, category: e.target.value}))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option value="feedback">Feedback</option>
              <option value="suggestion">Suggestion</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setOpenSubmit(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
