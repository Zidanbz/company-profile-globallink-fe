export interface RegionCoordinate {
  id: string;
  name: string;
  province: string;
  island: string;
  latitude: number;
  longitude: number;
}

export const INDONESIAN_REGIONS: RegionCoordinate[] = [
  // ── SULAWESI ──
  { id: "makassar", name: "Makassar", province: "Sulawesi Selatan", island: "Sulawesi", latitude: -5.1477, longitude: 119.4327 },
  { id: "gowa", name: "Gowa", province: "Sulawesi Selatan", island: "Sulawesi", latitude: -5.2045, longitude: 119.4533 },
  { id: "maros", name: "Maros", province: "Sulawesi Selatan", island: "Sulawesi", latitude: -5.0076, longitude: 119.5739 },
  { id: "parepare", name: "Parepare", province: "Sulawesi Selatan", island: "Sulawesi", latitude: -4.0131, longitude: 119.6267 },
  { id: "palopo", name: "Palopo", province: "Sulawesi Selatan", island: "Sulawesi", latitude: -2.9928, longitude: 120.1963 },
  { id: "manado", name: "Manado", province: "Sulawesi Utara", island: "Sulawesi", latitude: 1.4748, longitude: 124.8421 },
  { id: "bitung", name: "Bitung", province: "Sulawesi Utara", island: "Sulawesi", latitude: 1.4404, longitude: 125.1217 },
  { id: "palu", name: "Palu", province: "Sulawesi Tengah", island: "Sulawesi", latitude: -0.8917, longitude: 119.8707 },
  { id: "kendari", name: "Kendari", province: "Sulawesi Tenggara", island: "Sulawesi", latitude: -3.9985, longitude: 122.5126 },
  { id: "baubau", name: "Baubau", province: "Sulawesi Tenggara", island: "Sulawesi", latitude: -5.4633, longitude: 122.6189 },
  { id: "gorontalo", name: "Gorontalo", province: "Gorontalo", island: "Sulawesi", latitude: 0.5435, longitude: 123.0568 },
  { id: "mamuju", name: "Mamuju", province: "Sulawesi Barat", island: "Sulawesi", latitude: -2.6770, longitude: 118.8895 },

  // ── JAWA ──
  { id: "jakarta-pusat", name: "Jakarta Pusat", province: "DKI Jakarta", island: "Jawa", latitude: -6.1805, longitude: 106.8284 },
  { id: "jakarta-selatan", name: "Jakarta Selatan", province: "DKI Jakarta", island: "Jawa", latitude: -6.2615, longitude: 106.8106 },
  { id: "jakarta-barat", name: "Jakarta Barat", province: "DKI Jakarta", island: "Jawa", latitude: -6.1683, longitude: 106.7588 },
  { id: "jakarta-timur", name: "Jakarta Timur", province: "DKI Jakarta", island: "Jawa", latitude: -6.2250, longitude: 106.9004 },
  { id: "jakarta-utara", name: "Jakarta Utara", province: "DKI Jakarta", island: "Jawa", latitude: -6.1384, longitude: 106.8642 },
  { id: "surabaya", name: "Surabaya", province: "Jawa Timur", island: "Jawa", latitude: -7.2575, longitude: 112.7521 },
  { id: "malang", name: "Malang", province: "Jawa Timur", island: "Jawa", latitude: -7.9666, longitude: 112.6326 },
  { id: "sidoarjo", name: "Sidoarjo", province: "Jawa Timur", island: "Jawa", latitude: -7.4726, longitude: 112.6675 },
  { id: "bandung", name: "Bandung", province: "Jawa Barat", island: "Jawa", latitude: -6.9175, longitude: 107.6191 },
  { id: "bekasi", name: "Bekasi", province: "Jawa Barat", island: "Jawa", latitude: -6.2383, longitude: 106.9756 },
  { id: "depok", name: "Depok", province: "Jawa Barat", island: "Jawa", latitude: -6.4025, longitude: 106.7942 },
  { id: "bogor", name: "Bogor", province: "Jawa Barat", island: "Jawa", latitude: -6.5971, longitude: 106.8060 },
  { id: "cirebon", name: "Cirebon", province: "Jawa Barat", island: "Jawa", latitude: -6.7320, longitude: 108.5523 },
  { id: "semarang", name: "Semarang", province: "Jawa Tengah", island: "Jawa", latitude: -6.9667, longitude: 110.4167 },
  { id: "surakarta", name: "Surakarta (Solo)", province: "Jawa Tengah", island: "Jawa", latitude: -7.5755, longitude: 110.8243 },
  { id: "yogyakarta", name: "Yogyakarta", province: "DI Yogyakarta", island: "Jawa", latitude: -7.7956, longitude: 110.3695 },
  { id: "serang", name: "Serang", province: "Banten", island: "Jawa", latitude: -6.1104, longitude: 106.1608 },
  { id: "tangerang", name: "Tangerang", province: "Banten", island: "Jawa", latitude: -6.1783, longitude: 106.6319 },
  { id: "tangerang-selatan", name: "Tangerang Selatan (BSD)", province: "Banten", island: "Jawa", latitude: -6.2888, longitude: 106.7179 },

  // ── SUMATERA ──
  { id: "medan", name: "Medan", province: "Sumatera Utara", island: "Sumatera", latitude: 3.5952, longitude: 98.6722 },
  { id: "batam", name: "Batam", province: "Kepulauan Riau", island: "Sumatera", latitude: 1.1301, longitude: 104.0529 },
  { id: "tanjung-pinang", name: "Tanjung Pinang", province: "Kepulauan Riau", island: "Sumatera", latitude: 0.9167, longitude: 104.4500 },
  { id: "palembang", name: "Palembang", province: "Sumatera Selatan", island: "Sumatera", latitude: -2.9761, longitude: 104.7754 },
  { id: "pekanbaru", name: "Pekanbaru", province: "Riau", island: "Sumatera", latitude: 0.5071, longitude: 101.4478 },
  { id: "bandar-lampung", name: "Bandar Lampung", province: "Lampung", island: "Sumatera", latitude: -5.4500, longitude: 105.2667 },
  { id: "padang", name: "Padang", province: "Sumatera Barat", island: "Sumatera", latitude: -0.9471, longitude: 100.4172 },
  { id: "jambi", name: "Jambi", province: "Jambi", island: "Sumatera", latitude: -1.6101, longitude: 103.6131 },
  { id: "bengkulu", name: "Bengkulu", province: "Bengkulu", island: "Sumatera", latitude: -3.8004, longitude: 102.2655 },
  { id: "pangkal-pinang", name: "Pangkal Pinang", province: "Bangka Belitung", island: "Sumatera", latitude: -2.1316, longitude: 106.1106 },
  { id: "banda-aceh", name: "Banda Aceh", province: "Aceh", island: "Sumatera", latitude: 5.5483, longitude: 95.3238 },

  // ── KALIMANTAN ──
  { id: "balikpapan", name: "Balikpapan", province: "Kalimantan Timur", island: "Kalimantan", latitude: -1.2379, longitude: 116.8529 },
  { id: "samarinda", name: "Samarinda", province: "Kalimantan Timur", island: "Kalimantan", latitude: -0.5022, longitude: 117.1536 },
  { id: "ikn-nusantara", name: "IKN Nusantara", province: "Kalimantan Timur", island: "Kalimantan", latitude: -0.9744, longitude: 116.7039 },
  { id: "bontang", name: "Bontang", province: "Kalimantan Timur", island: "Kalimantan", latitude: 0.1333, longitude: 117.5000 },
  { id: "banjarmasin", name: "Banjarmasin", province: "Kalimantan Selatan", island: "Kalimantan", latitude: -3.3194, longitude: 114.5908 },
  { id: "banjarbaru", name: "Banjarbaru", province: "Kalimantan Selatan", island: "Kalimantan", latitude: -3.4402, longitude: 114.8306 },
  { id: "pontianak", name: "Pontianak", province: "Kalimantan Barat", island: "Kalimantan", latitude: -0.0263, longitude: 109.3425 },
  { id: "singkawang", name: "Singkawang", province: "Kalimantan Barat", island: "Kalimantan", latitude: 0.9069, longitude: 108.9869 },
  { id: "palangkaraya", name: "Palangka Raya", province: "Kalimantan Tengah", island: "Kalimantan", latitude: -2.2161, longitude: 113.9140 },
  { id: "tarakan", name: "Tarakan", province: "Kalimantan Utara", island: "Kalimantan", latitude: 3.3270, longitude: 117.5960 },
  { id: "tanjung-selor", name: "Tanjung Selor", province: "Kalimantan Utara", island: "Kalimantan", latitude: 2.8427, longitude: 117.3644 },

  // ── BALI & NUSA TENGGARA ──
  { id: "denpasar", name: "Denpasar (Bali)", province: "Bali", island: "Bali & Nusa Tenggara", latitude: -8.6705, longitude: 115.2126 },
  { id: "badung", name: "Badung / Kuta", province: "Bali", island: "Bali & Nusa Tenggara", latitude: -8.5833, longitude: 115.1833 },
  { id: "mataram", name: "Mataram (Lombok)", province: "Nusa Tenggara Barat", island: "Bali & Nusa Tenggara", latitude: -8.5833, longitude: 116.1167 },
  { id: "bima", name: "Bima", province: "Nusa Tenggara Barat", island: "Bali & Nusa Tenggara", latitude: -8.4608, longitude: 118.7265 },
  { id: "kupang", name: "Kupang", province: "Nusa Tenggara Timur", island: "Bali & Nusa Tenggara", latitude: -10.1772, longitude: 123.6070 },
  { id: "labuan-bajo", name: "Labuan Bajo", province: "Nusa Tenggara Timur", island: "Bali & Nusa Tenggara", latitude: -8.4964, longitude: 119.8877 },

  // ── MALUKU & PAPUA ──
  { id: "ambon", name: "Ambon", province: "Maluku", island: "Maluku & Papua", latitude: -3.6547, longitude: 128.1906 },
  { id: "ternate", name: "Ternate", province: "Maluku Utara", island: "Maluku & Papua", latitude: 0.7906, longitude: 127.3804 },
  { id: "sofifi", name: "Sofifi", province: "Maluku Utara", island: "Maluku & Papua", latitude: 0.7289, longitude: 127.5694 },
  { id: "jayapura", name: "Jayapura", province: "Papua", island: "Maluku & Papua", latitude: -2.5916, longitude: 140.6690 },
  { id: "sorong", name: "Sorong", province: "Papua Barat Daya", island: "Maluku & Papua", latitude: -0.8762, longitude: 131.2558 },
  { id: "manokwari", name: "Manokwari", province: "Papua Barat", island: "Maluku & Papua", latitude: -0.8615, longitude: 134.0620 },
  { id: "merauke", name: "Merauke", province: "Papua Selatan", island: "Maluku & Papua", latitude: -8.4991, longitude: 140.4011 },
  { id: "timika", name: "Timika", province: "Papua Tengah", island: "Maluku & Papua", latitude: -4.5468, longitude: 136.8837 },
  { id: "nabire", name: "Nabire", province: "Papua Tengah", island: "Maluku & Papua", latitude: -3.3667, longitude: 135.5000 },
  { id: "wamena", name: "Wamena", province: "Papua Pegunungan", island: "Maluku & Papua", latitude: -4.0991, longitude: 138.9482 },
];

/**
 * Mencari region terdekat atau berdasarkan kemiripan nama
 */
export function findClosestRegion(lat: number, lng: number): RegionCoordinate | undefined {
  let closest: RegionCoordinate | undefined;
  let minDistance = Infinity;

  for (const region of INDONESIAN_REGIONS) {
    const dLat = region.latitude - lat;
    const dLng = region.longitude - lng;
    const dist = dLat * dLat + dLng * dLng;
    if (dist < minDistance) {
      minDistance = dist;
      closest = region;
    }
  }

  // Jika jarak sangat dekat (sekitar radius 0.5 derajat / ~50km), anggap cocok
  if (minDistance < 0.25) {
    return closest;
  }
  return undefined;
}
