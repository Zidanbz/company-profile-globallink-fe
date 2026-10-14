"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { Card } from "@/components/base/Card";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { Globe, Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(email, password);
      localStorage.setItem("globallink_token", res.token);
      localStorage.setItem("globallink_user", JSON.stringify(res.user));
      router.push("/admin");
    } catch (err: any) {
      setError(
        err.message || "Gagal masuk. Periksa kembali email dan password Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-navy-950 via-slate-900 to-brand-950 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Globallink Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Masuk untuk mengelola konten dan titik infrastruktur
          </p>
        </div>

        {/* Login Card */}
        <Card padding="lg" className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Administrator"
              type="email"
              placeholder="admin@globallink.co.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              size="lg"
              isLoading={loading}
              className="w-full rounded-xl mt-2 font-bold justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Masuk ke Dashboard
            </Button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-brand-600 transition-colors"
            >
              ← Kembali ke Website Publik
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
