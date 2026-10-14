import Link from "next/link";
import { Button } from "@/components/base/Button";
import { Container } from "@/components/base/Container";
import { ArrowLeft, Globe } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Container size="sm" className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Globe className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-6xl font-black text-brand-600">404</h1>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Halaman yang Anda tuju mungkin telah dipindahkan atau tautan tidak lagi tersedia.
          </p>
        </div>

        <Link href="/">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Kembali ke Beranda
          </Button>
        </Link>
      </Container>
    </div>
  );
}
