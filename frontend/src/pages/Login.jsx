import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login(){
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try{
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      nav("/", { replace: true });
    }catch(error){
      setErr(error?.response?.data?.message || error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glass p-6">
        <h1 className="text-2xl font-extrabold">Login</h1>
        <p className="text-slate-300 text-sm mt-2">Demo admin credentials pre-filled.</p>

        {err ? <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{err}</div> : null}

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button disabled={loading} type="submit">{loading ? "Logging in..." : "Login"}</Button>
        </form>

        <div className="text-sm text-slate-300 mt-4">
          New user? <Link className="text-indigo-300 hover:text-indigo-200" to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
}
