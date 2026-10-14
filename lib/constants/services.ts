export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: "globe" | "camera" | "satellite" | "shopping-bag" | "cpu" | "server";
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "internet-service",
    title: "Internet Service",
    description: "Konektivitas internet berkecepatan tinggi dengan bandwidth dedicated simetris dan SLA 99.9%.",
    iconName: "globe",
  },
  {
    id: "smart-cctv",
    title: "Smart CCTV",
    description: "Pengawasan cerdas terintegrasi kecerdasan buatan (AI) untuk pengamanan aset properti & perkantoran.",
    iconName: "camera",
  },
  {
    id: "skystar",
    title: "SkyStar",
    description: "Solusi jaringan satelit broadband menjangkau area terpencil (remote) di seluruh pelosok nusantara.",
    iconName: "satellite",
  },
  {
    id: "purchasing",
    title: "Purchasing",
    description: "Pengadaan perangkat keras IT, server, dan peralatan jaringan enterprise dari principle global resmi.",
    iconName: "shopping-bag",
  },
  {
    id: "it-consulting",
    title: "IT Consulting",
    description: "Perencanaan strategis, audit keamanan siber, dan perancangan arsitektur teknologi bisnis Anda.",
    iconName: "cpu",
  },
  {
    id: "managed-service",
    title: "Managed Service",
    description: "Pemeliharaan komprehensif infrastruktur IT Anda oleh tim engineer bersertifikasi 24/7.",
    iconName: "server",
  },
];
