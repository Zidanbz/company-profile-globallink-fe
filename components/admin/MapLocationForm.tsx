"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapLocation, MapLocationCategory } from "@/types";
import { mapApi } from "@/lib/api/map";
import { Input } from "../base/Input";
import { Textarea } from "../base/Textarea";
import { Select } from "../base/Select";
import { Button } from "../base/Button";
import { Card } from "../base/Card";
import { Save, ArrowLeft, MapPin, Search, CheckCircle2, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  INDONESIAN_REGIONS,
  RegionCoordinate,
  findClosestRegion,
} from "@/lib/constants/indonesianRegions";

export interface MapLocationFormProps {
  initialData?: MapLocation;
  isEditing?: boolean;
}

export const MapLocationForm: React.FC<MapLocationFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();

  // Region / City State
  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => {
    if (initialData?.latitude && initialData?.longitude) {
      const match = findClosestRegion(
        Number(initialData.latitude),
        Number(initialData.longitude)
      );
      return match ? match.id : "custom";
    }
    return "makassar"; // Default to Makassar
  });

  const [selectedRegionName, setSelectedRegionName] = useState<string>(() => {
    if (initialData?.latitude && initialData?.longitude) {
      const match = findClosestRegion(
        Number(initialData.latitude),
        Number(initialData.longitude)
      );
      return match ? `${match.name} (${match.province})` : "Wilayah Tersimpan";
    }
    return "Makassar (Sulawesi Selatan)";
  });

  const [latitude, setLatitude] = useState<number>(() => {
    if (initialData?.latitude !== undefined) return Number(initialData.latitude);
    return -5.1477; // Makassar default
  });

  const [longitude, setLongitude] = useState<number>(() => {
    if (initialData?.longitude !== undefined) return Number(initialData.longitude);
    return 119.4327; // Makassar default
  });

  // Online custom search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ name: string; lat: number; lon: number }>>([]);
  const [showCustomSearch, setShowCustomSearch] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState<MapLocationCategory>(
    initialData?.category || "POP"
  );
  const [description, setDescription] = useState(initialData?.description || "");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle preset region change
  const handleRegionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "search_online") {
      setShowCustomSearch(true);
      return;
    }

    const reg = INDONESIAN_REGIONS.find((r) => r.id === val);
    if (reg) {
      setSelectedRegionId(reg.id);
      setSelectedRegionName(`${reg.name} (${reg.province})`);
      setLatitude(reg.latitude);
      setLongitude(reg.longitude);
      setShowCustomSearch(false);

      // Auto-suggest name if empty
      if (!name) {
        setName(`${getCategoryLabel(category)} ${reg.name}`);
      }
    }
  };

  const getCategoryLabel = (cat: MapLocationCategory) => {
    switch (cat) {
      case "FIBER_OPTIC":
        return "Backbone FO";
      case "DATA_CENTER":
        return "Data Center";
      case "OFFICE":
        return "Kantor & NOC";
      case "COVERAGE":
        return "Area Layanan";
      default:
        return "POP";
    }
  };

  // Online geocoding search for any city/district in Indonesia
  const handleOnlineSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.trim() + ", Indonesia"
        )}&limit=5&countrycodes=id`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(
          data.map((item: any) => ({
            name: item.display_name.split(",").slice(0, 3).join(","),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          }))
        );
      } else {
        alert("Wilayah tidak ditemukan. Coba ketik nama kota/kabupaten lain.");
      }
    } catch (err) {
      alert("Pencarian geocoding online sedang sibuk. Silakan gunakan daftar kota yang tersedia.");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (item: { name: string; lat: number; lon: number }) => {
    setSelectedRegionId("custom");
    setSelectedRegionName(item.name);
    setLatitude(item.lat);
    setLongitude(item.lon);
    setSearchResults([]);
    setShowCustomSearch(false);
    if (!name) {
      const shortName = item.name.split(",")[0];
      setName(`${getCategoryLabel(category)} ${shortName}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Nama lokasi / sentra wajib diisi";
    if (isNaN(latitude) || isNaN(longitude)) {
      newErrors.region = "Pilih wilayah atau kota terlebih dahulu";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        name: name.trim(),
        category,
        latitude,
        longitude,
        description: description.trim() ? description : undefined,
      };

      if (isEditing && initialData) {
        await mapApi.updateLocation(initialData.id, payload as any);
      } else {
        await mapApi.createLocation(payload as any);
      }

      router.push("/admin/map");
      router.refresh();
    } catch (err: any) {
      setErrors({ global: err.message || "Gagal menyimpan titik lokasi." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/map">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Kembali
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Titik Lokasi Peta" : "Tambah Titik Wilayah Baru"}
          </h2>
        </div>

        <Button
          type="submit"
          isLoading={submitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isEditing ? "Perbarui Titik" : "Simpan ke Peta"}
        </Button>
      </div>

      {errors.global && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {errors.global}
        </div>
      )}

      <Card padding="lg" className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* ── PILIH WILAYAH / KOTA (PENENTUAN TANPA LAT/LNG) ── */}
        <div className="space-y-3 p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Pilih Wilayah / Kota Indonesia *</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCustomSearch(!showCustomSearch)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{showCustomSearch ? "Gunakan Daftar Pilihan" : "Cari Kota/Kecamatan Lain"}</span>
            </button>
          </div>

          {!showCustomSearch ? (
            <div>
              <select
                value={selectedRegionId}
                onChange={handleRegionSelect}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              >
                <optgroup label="📍 SULAWESI (Pusat & Regional Hub)">
                  {INDONESIAN_REGIONS.filter((r) => r.island === "Sulawesi").map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.province}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📍 JAWA & BALI">
                  {INDONESIAN_REGIONS.filter((r) => r.island === "Jawa" || r.island === "Bali & Nusa Tenggara").map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.province}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📍 SUMATERA">
                  {INDONESIAN_REGIONS.filter((r) => r.island === "Sumatera").map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.province}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📍 KALIMANTAN (Termasuk IKN)">
                  {INDONESIAN_REGIONS.filter((r) => r.island === "Kalimantan").map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.province}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📍 MALUKU & PAPUA">
                  {INDONESIAN_REGIONS.filter((r) => r.island === "Maluku & Papua").map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.province}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik nama kota / kabupaten / kecamatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleOnlineSearch(e)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
                <Button
                  type="button"
                  onClick={handleOnlineSearch}
                  isLoading={searching}
                  size="sm"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Cari
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700 max-h-48 overflow-y-auto">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        Pilih Lokasi Ini →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Konfirmasi Wilayah Terpilih */}
          <div className="flex items-center gap-2 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Wilayah Terpasang: <strong className="text-emerald-700 dark:text-emerald-400">{selectedRegionName}</strong>
            </p>
          </div>
          {errors.region && (
            <p className="text-xs text-red-600 font-medium">{errors.region}</p>
          )}
        </div>

        {/* ── NAMA LOKASI & SENTRA ── */}
        <Input
          label="Nama Fasilitas / Sentra Jaringan *"
          placeholder="Contoh: Kantor Cabang Graha Pena, POP Surabaya Gubeng, Data Center Cyber 2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          helperText="Nama yang akan tampil pada pin dan daftar kota di peta"
        />

        {/* ── KATEGORI INFRASTRUKTUR ── */}
        <Select
          label="Kategori Infrastruktur Jaringan"
          value={category}
          onChange={(e) => {
            const newCat = e.target.value as MapLocationCategory;
            setCategory(newCat);
          }}
          options={[
            { label: "Point of Presence (POP)", value: "POP" },
            { label: "Fiber Optic Network (Kabel Optik)", value: "FIBER_OPTIC" },
            { label: "Data Center", value: "DATA_CENTER" },
            { label: "Office & NOC (Pusat Komando)", value: "OFFICE" },
            { label: "Coverage Area (Area Layanan)", value: "COVERAGE" },
            { label: "Lainnya", value: "OTHER" },
          ]}
        />

        {/* ── KETERANGAN FASILITAS ── */}
        <Textarea
          label="Keterangan / Fasilitas Jaringan (Opsional)"
          placeholder="Misal: Backbone fiber optic dual-ring 100 Gbps, redundansi power genset 24/7..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Card>
    </form>
  );
};
