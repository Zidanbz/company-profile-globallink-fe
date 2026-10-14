"use client";

import React, { useState, useEffect } from "react";
import { Container } from "../base/Container";
import { motion } from "framer-motion";
import { partnersApi } from "@/lib/api/partners";
import { PartnerLogoData } from "@/types";
import { Handshake, Building2 } from "lucide-react";

// Default Strategic Partners (Principals / Vendors / Providers) - 100% HD Vectors, 0 Local Files
const DEFAULT_PARTNERS: PartnerLogoData[] = [
  {
    id: 1,
    name: "APJII",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="70" height="50" rx="10" fill="#0047BA"/><text x="40" y="42" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">APJII</text><text x="68" y="24" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="7" fill="#FFFFFF">TM</text><line x1="85" y1="12" x2="85" y2="58" stroke="#0047BA" stroke-width="2"/><text x="94" y="23" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="8.5" fill="#0047BA">Asosiasi</text><text x="94" y="33" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="8.5" fill="#0047BA">Penyelenggara</text><text x="94" y="43" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="8.5" fill="#0047BA">Jasa Internet</text><text x="94" y="53" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="8.5" fill="#0047BA">Indonesia</text><text x="120" y="65" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="5" fill="#555555" text-anchor="middle" letter-spacing="0.5">INDONESIA INTERNET SERVICE PROVIDER ASSOCIATION</text></svg>',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    name: "IDNIC",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="38" cy="35" rx="26" ry="16" transform="rotate(-30 38 35)" stroke="#0072BC" stroke-width="5" fill="none"/><circle cx="34" cy="30" r="10" fill="#002D62"/><path d="M22 42C30 48 48 48 54 36" stroke="#00A859" stroke-width="3" stroke-linecap="round"/><text x="75" y="42" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#002D62" letter-spacing="-0.5">idnic</text><text x="145" y="27" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="10" fill="#002D62">indonesia</text><text x="145" y="38" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="10" fill="#002D62">network</text><text x="145" y="49" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="10" fill="#002D62">information</text><text x="145" y="60" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="10" fill="#002D62">centre</text></svg>',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    name: "Pandai",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M125 15C135 15 145 22 142 32C138 27 132 25 125 25C132 28 136 34 133 42C128 35 120 34 112 36C120 40 124 48 118 54C108 45 98 46 90 50C100 42 108 26 125 15Z" fill="#38B6FF"/><text x="15" y="44" font-family="\'Trebuchet MS\', Arial, sans-serif" font-weight="700" font-size="34" fill="#0275B1">Pandai</text><text x="18" y="58" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="8.5" fill="#0275B1" letter-spacing="0.5">pintu data indonesia</text></svg>',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    name: "Moratelindo",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 48C18 32 25 18 36 24C44 29 40 46 48 48C56 50 62 30 68 36C70 38 68 46 62 48C52 50 44 38 38 32C30 26 25 36 22 48H15Z" fill="#E30613"/><text x="75" y="42" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="900" font-size="24" fill="#1C1D1F">Moratelindo</text><text x="78" y="55" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="9" fill="#E30613" letter-spacing="1.5">broadband company</text></svg>',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    name: "Biznet InternetExchange",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 210 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 16C15 16 32 16 32 30C32 38 24 43 24 43C36 43 45 50 42 58C39 65 24 64 15 54C22 55 28 53 28 48C28 44 22 40 18 40V16Z" fill="#00AEEF"/><ellipse cx="23" cy="28" rx="4" ry="5" fill="#FFFFFF"/><ellipse cx="25" cy="50" rx="4" ry="4" fill="#FFFFFF"/><text x="48" y="36" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#1A1A1A">Biznet</text><text x="48" y="52" font-family="Arial, sans-serif" font-weight="600" font-size="13" fill="#00AEEF" letter-spacing="0.5">InternetExchange</text></svg>',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 6,
    name: "BAKTI KOMDIGI",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="10" y="38" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#003366" letter-spacing="1.5">B</text><path d="M37 38L47 16L57 38H49L47 33L45 38H37Z" fill="#003366"/><polygon points="47,10 44,14 50,14" fill="#E30613"/><text x="59" y="38" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#003366" letter-spacing="1.5">KTI</text><text x="10" y="56" font-family="Arial, sans-serif" font-weight="900" font-size="16" fill="#003366" letter-spacing="2">KOMDIGI</text></svg>',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 7,
    name: "Matrix NAP Info",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="15" y="44" font-family="\'Arial Black\', Impact, sans-serif" font-style="italic" font-weight="900" font-size="32" fill="#1A1A1A">matri</text><path d="M125 18L145 44H135L120 24L125 18Z" fill="#E30613"/><path d="M142 18L122 44H132L147 24L142 18Z" fill="#0047BA"/><text x="15" y="58" font-family="Arial, sans-serif" font-weight="700" font-size="8.5" fill="#1A1A1A" letter-spacing="0.5">Quality Reliability Speed</text></svg>',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 8,
    name: "Hytera",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M110 22C118 20 128 24 135 30C125 28 116 27 110 22Z" fill="#78BE20"/><path d="M112 28C124 28 134 35 140 42C128 38 118 35 112 28Z" fill="#005A9C"/><text x="15" y="46" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="800" font-size="30" fill="#2B2B2B">Hytera</text></svg>',
    sortOrder: 8,
    isActive: true,
  },
  {
    id: 9,
    name: "DATABUMI",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="22" stroke="#002D62" stroke-width="3" fill="#FFFFFF"/><ellipse cx="35" cy="35" rx="10" ry="22" stroke="#002D62" stroke-width="2"/><line x1="13" y1="35" x2="57" y2="35" stroke="#002D62" stroke-width="2"/><line x1="16" y1="25" x2="54" y2="25" stroke="#002D62" stroke-width="1.5"/><line x1="16" y1="45" x2="54" y2="45" stroke="#002D62" stroke-width="1.5"/><text x="68" y="38" font-family="\'Arial Black\', Arial, sans-serif" font-weight="900" font-size="24" fill="#002D62" letter-spacing="1">DATABUMI</text><text x="69" y="50" font-family="Arial, sans-serif" font-weight="600" font-size="6.5" fill="#555555" letter-spacing="0.2">Surveying &amp; Mapping | Software Developer | IoT | GIS</text></svg>',
    sortOrder: 9,
    isActive: true,
  },
  {
    id: 10,
    name: "pakAImuka",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="35" r="18" stroke="#1A1A1A" stroke-width="2" fill="none"/><path d="M22 28Q24 24 28 28M34 28Q36 24 40 28" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/><path d="M30 30V35H27" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/><path d="M25 42Q30 46 35 42" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/><text x="56" y="36" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="700" font-size="19" fill="#1A1A1A">pak</text><text x="92" y="36" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="900" font-size="20" fill="#E30613">AI</text><text x="115" y="36" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="700" font-size="19" fill="#1A1A1A">muka</text><text x="56" y="49" font-family="Arial, sans-serif" font-weight="600" font-size="7.5" fill="#555555" letter-spacing="0.4">Your Biometric Security System</text></svg>',
    sortOrder: 10,
    isActive: true,
  },
  {
    id: 11,
    name: "HERZA Cloud",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="10" y="44" font-family="\'Arial Black\', Impact, sans-serif" font-weight="900" font-size="32" fill="#212529" letter-spacing="2">HERZ</text><path d="M125 18L130 18L148 44H138L125 24V18Z" fill="#E30613"/><text x="142" y="44" font-family="\'Arial Black\', Impact, sans-serif" font-weight="900" font-size="32" fill="#212529">A</text></svg>',
    sortOrder: 11,
    isActive: true,
  },
  {
    id: 12,
    name: "Trans Hybrid",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 200 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="24" width="7" height="7" fill="#FDB813"/><rect x="23" y="16" width="7" height="7" fill="#E30613"/><rect x="31" y="24" width="7" height="7" fill="#8B2183"/><rect x="23" y="32" width="7" height="7" fill="#00AEEF"/><text x="44" y="34" font-family="\'Brush Script MT\', \'Trebuchet MS\', cursive, sans-serif" font-size="22" font-weight="bold" fill="#1C1D1F">Trans Hybrid</text><path d="M20 48C45 52 80 50 140 44" stroke="#1C1D1F" stroke-width="1.5" stroke-linecap="round" fill="none"/><text x="45" y="54" font-family="Arial, sans-serif" font-weight="700" font-size="6.5" fill="#1C1D1F" letter-spacing="0.8">YOUR TRUSTED PARTNER</text></svg>',
    sortOrder: 12,
    isActive: true,
  },
  {
    id: 13,
    name: "CD-IX",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 38C25 18 55 18 68 28" stroke="#003399" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M30 46C45 54 75 52 85 36" stroke="#FF6600" stroke-width="4" stroke-linecap="round" fill="none"/><text x="32" y="44" font-family="\'Arial Black\', Impact, sans-serif" font-style="italic" font-weight="900" font-size="30" fill="#003399">CD</text><text x="82" y="44" font-family="\'Arial Black\', Impact, sans-serif" font-style="italic" font-weight="900" font-size="30" fill="#FF6600">-IX</text></svg>',
    sortOrder: 13,
    isActive: true,
  },
  {
    id: 14,
    name: "iFORTE",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 20C26 16 30 16 34 20" stroke="#00A651" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M25 24C27 22 29 22 31 24" stroke="#00A651" stroke-width="2" stroke-linecap="round" fill="none"/><text x="25" y="44" font-family="Arial, sans-serif" font-style="italic" font-weight="900" font-size="28" fill="#555555">iFORTE</text><text x="26" y="56" font-family="Arial, sans-serif" font-weight="600" font-size="7.5" fill="#777777" letter-spacing="0.5">Connectivity for Better Life</text></svg>',
    sortOrder: 14,
    isActive: true,
  },
  {
    id: 15,
    name: "NTT",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 160 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="18" stroke="#0055B8" stroke-width="5" fill="none"/><circle cx="35" cy="35" r="7" fill="#0055B8"/><path d="M35 17C45 17 53 25 53 35" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/><text x="68" y="44" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="#1C1D1F" letter-spacing="1">NTT</text></svg>',
    sortOrder: 15,
    isActive: true,
  },
  {
    id: 16,
    name: "HIKVISION",
    category: "PARTNER",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="15" y="46" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="900" font-size="32" fill="#D71920" letter-spacing="0.5">HIKVISION</text><polygon points="62,18 69,14 69,21" fill="#D71920"/><polygon points="126,18 133,14 133,21" fill="#D71920"/></svg>',
    sortOrder: 16,
    isActive: true,
  },
];

// Default Enterprise Clients (Institutions / Corporates / Enterprise) - 100% HD Vectors, 0 Local Files
const DEFAULT_CLIENTS: PartnerLogoData[] = [
  {
    id: 101,
    name: "Bank Indonesia",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 240 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 14L52 24V44L35 54L18 44V24L35 14Z" stroke="#003366" stroke-width="2.5" fill="#F4F8FC"/><text x="35" y="41" font-family="\'Times New Roman\', serif" font-weight="bold" font-size="20" fill="#003366" text-anchor="middle">BI</text><text x="64" y="34" font-family="\'Times New Roman\', serif" font-weight="bold" font-size="16" fill="#003366" letter-spacing="1">BANK INDONESIA</text><text x="65" y="46" font-family="Arial, sans-serif" font-weight="700" font-size="6.5" fill="#003366" letter-spacing="0.5">BANK SENTRAL REPUBLIK INDONESIA</text></svg>',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 102,
    name: "Bank BTN",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 160 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="42" y="18" width="30" height="5" rx="2.5" fill="#ED1C24"/><text x="15" y="48" font-family="\'Arial Black\', Impact, sans-serif" font-weight="900" font-size="38" fill="#005BAA">btn</text></svg>',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 103,
    name: "Bank Mandiri",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M85 24C100 16 125 18 140 24C130 20 105 21 95 27Z" fill="#FDB813"/><path d="M95 27C115 18 135 22 145 28C132 23 110 24 100 30Z" fill="#F39200"/><text x="15" y="45" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="#002D62" letter-spacing="-0.5">mandiri</text></svg>',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 104,
    name: "Sari Roti",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="16" width="130" height="34" rx="4" fill="#14234B"/><text x="80" y="40" font-family="\'Arial Black\', Impact, sans-serif" font-weight="900" font-size="19" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">SARI ROTI</text><ellipse cx="80" cy="54" rx="8" ry="7" stroke="#FDB813" stroke-width="2.5" fill="none"/><path d="M80 50C83 50 85 52 84 55C83 57 80 58 77 56" stroke="#FDB813" stroke-width="2" fill="none"/></svg>',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 105,
    name: "Vasaka Hotel",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="15" y="44" font-family="\'Brush Script MT\', \'Lucida Handwriting\', cursive, sans-serif" font-size="34" font-weight="bold" fill="#8B1D2C">Vasaka</text><text x="110" y="46" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#2B2B2B" letter-spacing="1">HOTEL</text></svg>',
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 106,
    name: "KIMA",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 160 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 44C24 38 28 32 30 26C34 30 36 34 34 40C32 43 28 45 26 44Z" fill="#856404"/><path d="M30 46C30 38 36 32 40 24C46 32 46 40 40 46Z" fill="#FDB813"/><text x="52" y="44" font-family="\'Times New Roman\', serif" font-weight="bold" font-size="28" fill="#1C1D1F" letter-spacing="2">KIMA</text></svg>',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 107,
    name: "Ceria Nugraha Indotama",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 15A20 20 0 0 0 15 35H35V15Z" fill="#FDB813"/><path d="M35 15A20 20 0 0 1 55 35H35V15Z" fill="#E30613"/><path d="M35 55A20 20 0 0 0 55 35H35V55Z" fill="#E30613"/><path d="M35 55A20 20 0 0 1 15 35H35V55Z" fill="#1C1D1F"/><text x="66" y="30" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#003366">CERIA</text><text x="66" y="44" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#003366">NUGRAHA</text><text x="66" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#003366">INDOTAMA</text></svg>',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 108,
    name: "Smart in pays",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="18" width="34" height="34" rx="10" fill="#00AEEF"/><text x="32" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">S</text><text x="58" y="38" font-family="\'Century Gothic\', Arial, sans-serif" font-weight="700" font-size="17" fill="#00AEEF">Smart in pays</text></svg>',
    sortOrder: 8,
    isActive: true,
  },
  {
    id: 109,
    name: "Borwita Citra Prima",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 210 70" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="15" y="42" font-family="\'Arial Black\', Arial, sans-serif" font-weight="900" font-size="21" fill="#1C1D1F">BORW</text><path d="M88 24L93 42L98 24H103L95 45L86 24H88Z" fill="#E30613"/><text x="100" y="42" font-family="\'Arial Black\', Arial, sans-serif" font-weight="900" font-size="21" fill="#1C1D1F">ITA</text><text x="82" y="54" font-family="Arial, sans-serif" font-weight="700" font-size="8" fill="#555555" letter-spacing="1">CITRA PRIMA</text></svg>',
    sortOrder: 9,
    isActive: true,
  },
  {
    id: 110,
    name: "Ciputra Group",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 18L52 38H45L40 28L35 38H28L40 18Z" fill="#007A3D"/><circle cx="40" cy="24" r="2.5" fill="#007A3D"/><text x="18" y="54" font-family="\'Times New Roman\', serif" font-weight="bold" font-size="18" fill="#1C1D1F" letter-spacing="1">CIPUTRA</text></svg>',
    sortOrder: 10,
    isActive: true,
  },
  {
    id: 111,
    name: "BSS Parking",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 170 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 18L38 14V44L25 48V18Z" fill="#005A9C"/><path d="M38 14L48 20V50L38 44V14Z" fill="#78BE20"/><text x="32" y="34" font-family="Arial, sans-serif" font-weight="900" font-size="9" fill="#FFFFFF">BSS</text><text x="24" y="58" font-family="Arial, sans-serif" font-weight="700" font-size="7" fill="#1C1D1F" letter-spacing="0.5">BSS PARKING</text></svg>',
    sortOrder: 11,
    isActive: true,
  },
  {
    id: 112,
    name: "Pemprov Sulawesi Selatan",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 12C20 12 16 22 16 35C16 52 35 60 35 60C35 60 54 52 54 35C54 22 50 12 35 12Z" fill="#B32025" stroke="#FDB813" stroke-width="2"/><circle cx="35" cy="36" r="14" fill="#007A3D"/><polygon points="35,26 38,34 32,34" fill="#FDB813"/><text x="64" y="34" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#003366">PEMPROV</text><text x="64" y="48" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#003366">SULSEL</text></svg>',
    sortOrder: 12,
    isActive: true,
  },
  {
    id: 113,
    name: "Direktorat Jenderal Imigrasi",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 190 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 12L52 20V42C52 52 35 60 35 60C35 60 18 52 18 42V20L35 12Z" fill="#003366" stroke="#FDB813" stroke-width="2"/><circle cx="35" cy="35" r="10" stroke="#FDB813" stroke-width="1.5" fill="none"/><text x="35" y="39" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#FDB813" text-anchor="middle">RI</text><text x="64" y="35" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#003366">KANTOR</text><text x="64" y="49" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#003366">IMIGRASI</text></svg>',
    sortOrder: 13,
    isActive: true,
  },
  {
    id: 114,
    name: "Pemkab Gowa",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 12C20 12 18 24 18 36C18 50 35 58 35 58C35 58 52 50 52 36C52 24 50 12 35 12Z" fill="#006837" stroke="#FDB813" stroke-width="2"/><circle cx="35" cy="34" r="10" fill="#FDB813"/><text x="62" y="35" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#006837">PEMKAB</text><text x="62" y="49" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#006837">GOWA</text></svg>',
    sortOrder: 14,
    isActive: true,
  },
  {
    id: 115,
    name: "Pemkab Maros",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 12C20 12 18 24 18 36C18 50 35 58 35 58C35 58 52 50 52 36C52 24 50 12 35 12Z" fill="#0071BC" stroke="#FDB813" stroke-width="2"/><circle cx="35" cy="34" r="10" fill="#FFFFFF"/><text x="62" y="35" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#0071BC">PEMKAB</text><text x="62" y="49" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#0071BC">MAROS</text></svg>',
    sortOrder: 15,
    isActive: true,
  },
  {
    id: 116,
    name: "Pemkab Sinjai",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 12L50 20V42C50 52 35 58 35 58C35 58 20 52 20 42V20L35 12Z" fill="#006837" stroke="#FDB813" stroke-width="2"/><circle cx="35" cy="35" r="10" fill="#B32025"/><text x="62" y="35" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#006837">PEMKAB</text><text x="62" y="49" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#006837">SINJAI</text></svg>',
    sortOrder: 16,
    isActive: true,
  },
  {
    id: 117,
    name: "Pemkab Takalar",
    category: "CLIENT",
    logoUrl: "",
    svgContent: '<svg viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 12C20 12 18 24 18 36C18 50 35 58 35 58C35 58 52 50 52 36C52 24 50 12 35 12Z" fill="#006837" stroke="#FDB813" stroke-width="2"/><polygon points="35,24 43,40 27,40" fill="#FDB813"/><text x="62" y="35" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#006837">PEMKAB</text><text x="62" y="49" font-family="Arial, sans-serif" font-weight="900" font-size="12" fill="#006837">TAKALAR</text></svg>',
    sortOrder: 17,
    isActive: true,
  },
];

export const PartnersSection: React.FC = () => {
  const [partnerLogos, setPartnerLogos] = useState<PartnerLogoData[]>(DEFAULT_PARTNERS);
  const [clientLogos, setClientLogos] = useState<PartnerLogoData[]>(DEFAULT_CLIENTS);

  useEffect(() => {
    partnersApi
      .getAllPublic()
      .then((data) => {
        if (data && data.length > 0) {
          const partners = data.filter((item) => (item.category || "PARTNER").toUpperCase() === "PARTNER");
          const clients = data.filter((item) => item.category?.toUpperCase() === "CLIENT");

          if (partners.length > 0) setPartnerLogos(partners);
          if (clients.length > 0) setClientLogos(clients);
        }
      })
      .catch(() => {
        // Fallback to defaults
      });
  }, []);

  // Double list for smooth infinite loop
  const loopPartners = [...partnerLogos, ...partnerLogos];
  const loopClients = [...clientLogos, ...clientLogos];

  return (
    <section id="mitra" className="relative py-12 sm:py-16 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-200 border-b border-slate-100 dark:border-slate-800/80">
      
      {/* High-Grade Horizontal Edge Fades */}
      <div className="absolute left-0 inset-y-0 w-16 sm:w-36 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-16 sm:w-36 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />

      <Container size="xl" className="relative z-0 space-y-10 sm:space-y-12">
        
        {/* ── ROW 1: MITRA & PARTNER ── */}
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Handshake className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase text-[#0a193b] dark:text-white">
              Mitra & Partner
            </h3>
          </div>

          <div className="flex overflow-hidden select-none">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
              className="flex items-center gap-12 sm:gap-20 shrink-0 pr-12 sm:pr-20"
            >
              {loopPartners.map((partner, idx) => (
                <div
                  key={`partner-${partner.id}-${idx}`}
                  className="transition-all duration-300 hover:scale-105 cursor-pointer shrink-0 flex items-center justify-center h-14 sm:h-16 px-3"
                  title={partner.name}
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-9 sm:h-11 md:h-12 w-auto max-w-[150px] object-contain transition-transform duration-200"
                    />
                  ) : partner.svgContent ? (
                    <div
                      className="h-10 sm:h-12 md:h-14 w-auto max-w-[170px] flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-[170px] [&>svg]:object-contain transition-transform duration-200"
                      dangerouslySetInnerHTML={{ __html: partner.svgContent }}
                    />
                  ) : (
                    <span className="font-bold text-sm sm:text-base tracking-tight text-slate-800 dark:text-slate-100">{partner.name}</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── DIVIDER LINE ── */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        {/* ── ROW 2: CLIENT ── */}
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase text-[#0a193b] dark:text-white">
              Client
            </h3>
          </div>

          <div className="flex overflow-hidden select-none py-1">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              className="flex items-center gap-10 sm:gap-16 shrink-0 pr-10 sm:pr-16"
            >
              {loopClients.map((client, idx) => (
                <div
                  key={`client-${client.id}-${idx}`}
                  className="transition-all duration-300 hover:scale-110 cursor-pointer shrink-0 flex items-center justify-center h-14 sm:h-16 md:h-20 px-3"
                  title={client.name}
                >
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="h-10 sm:h-12 md:h-14 w-auto max-w-[160px] object-contain transition-transform duration-200"
                    />
                  ) : client.svgContent ? (
                    <div
                      className="h-10 sm:h-12 md:h-14 w-auto max-w-[170px] flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-[170px] [&>svg]:object-contain transition-transform duration-200"
                      dangerouslySetInnerHTML={{ __html: client.svgContent }}
                    />
                  ) : (
                    <span className="font-bold text-sm sm:text-base tracking-tight text-slate-800 dark:text-slate-100">{client.name}</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </Container>
    </section>
  );
};
