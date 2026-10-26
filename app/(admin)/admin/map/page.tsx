"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapLocation, MapLocationCategory } from "@/types";
import { mapApi } from "@/lib/api/map";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/base/Table";
import { Button } from "@/components/base/Button";
import { Badge } from "@/components/base/Badge";
import { Input } from "@/components/base/Input";
import { Select } from "@/components/base/Select";
import { LoadingState } from "@/components/base/LoadingState";
import { EmptyState } from "@/components/base/EmptyState";
import { Modal } from "@/components/base/Modal";
import { PlusCircle, Search, Edit3, Trash2, MapPin } from "lucide-react";

export default function AdminMapPage() {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<MapLocation | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await mapApi.getAdminLocations({
        search,
        category: (category as MapLocationCategory) || undefined,
      });
      setLocations(data);
    } catch (e) {
      console.error("Failed to fetch map locations", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocations();
  };

  const confirmDelete = async () => {
    if (!selectedLoc) return;
    setDeleting(true);
    try {
      await mapApi.deleteLocation(selectedLoc.id);
      setDeleteModalOpen(false);
      setSelectedLoc(null);
      fetchLocations();
    } catch (e) {
      alert("Gagal menghapus titik lokasi");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Titik Infrastruktur & POP
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola koordinat jaringan kabel optik, data center, dan pusat komando NOC
          </p>
        </div>

        <Link href="/admin/map/create">
          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Tambah Titik Lokasi
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
          <Input
            placeholder="Cari lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </form>

        <div className="w-full sm:w-60">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { label: "Semua Kategori", value: "" },
              { label: "Point of Presence (POP)", value: "POP" },
              { label: "Fiber Optic", value: "FIBER_OPTIC" },
              { label: "Data Center", value: "DATA_CENTER" },
              { label: "Office & NOC", value: "OFFICE" },
              { label: "Coverage Area", value: "COVERAGE" },
              { label: "Lainnya", value: "OTHER" },
            ]}
          />
        </div>
      </div>

      {/* Locations Table */}
      {loading ? (
        <LoadingState message="Memuat titik infrastruktur..." />
      ) : locations.length === 0 ? (
        <EmptyState
          icon={<MapPin className="w-6 h-6" />}
          title="Belum Ada Titik Lokasi"
          description="Tambahkan titik POP atau infrastruktur jaringan baru untuk ditampilkan pada peta interaktif."
          action={
            <Link href="/admin/map/create">
              <Button size="sm">Tambah Titik Lokasi</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Lokasi</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Koordinat</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className="font-bold text-slate-900 dark:text-white">
                  {loc.name}
                </TableCell>
                <TableCell>
                  <Badge variant="cyan" size="sm">
                    {loc.category.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}
                </TableCell>
                <TableCell className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                  {loc.description || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link href={`/admin/map/${loc.id}/edit`}>
                      <button
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedLoc(loc);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus Titik Lokasi"
        description="Apakah Anda yakin ingin menghapus titik lokasi infrastruktur ini dari peta?"
      >
        <div className="pt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteModalOpen(false)}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={deleting}
            onClick={confirmDelete}
          >
            Hapus Lokasi
          </Button>
        </div>
      </Modal>
    </div>
  );
}
