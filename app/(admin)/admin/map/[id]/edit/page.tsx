"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapLocation } from "@/types";
import { mapApi } from "@/lib/api/map";
import { MapLocationForm } from "@/components/admin/MapLocationForm";
import { LoadingState } from "@/components/base/LoadingState";
import { ErrorState } from "@/components/base/ErrorState";

export default function EditMapLocationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [location, setLocation] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocation = async () => {
    if (!id || isNaN(id)) {
      setError("ID lokasi tidak valid");
      setLoading(false);
      return;
    }

    try {
      const data = await mapApi.getLocationById(id);
      setLocation(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data titik lokasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocation();
  }, [id]);

  if (loading) return <LoadingState message="Mengambil data titik lokasi..." />;
  if (error || !location) {
    return (
      <ErrorState
        title="Titik Lokasi Tidak Ditemukan"
        message={error || "Data titik lokasi tidak dapat dimuat."}
        onRetry={() => router.push("/admin/map")}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <MapLocationForm initialData={location} isEditing />
    </div>
  );
}
