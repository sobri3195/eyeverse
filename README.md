# EYEVERSE AI

EYEVERSE AI adalah platform web React + Vite bergaya premium medical-tech untuk simulasi 41 teknologi AI mata dan 20 teknologi mata non-AI dalam satu aplikasi dashboard responsif.

## Stack
- React + Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Lucide React
- jsPDF + CSV export
- Context + Hooks (client-side state)

## Fitur Utama
- 19 halaman lengkap: landing, auth, dashboard, modul AI/alat mata, detail modul, upload, diagnosis, analytics, reports, history, education, chatbot, admin, about, contact, 404.
- 41 modul AI dan 20 modul perangkat mata dengan filter, sort, detail, simulasi, dan status aktif.
- Dummy data lokal: 50 pasien, 50 scan, 20 laporan.
- Dark/light mode, toast notification, modal, chart, export PDF/CSV, dan dummy role system.
- Branding konsisten **Created by Dr. Sobri** (footer, login, about).

## Instalasi Lokal
```bash
npm install
npm run dev
```

## Build Produksi
```bash
npm run build
npm run preview
```

## Deploy ke Vercel
1. Push repository ke Git provider.
2. Import project di Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

Seluruh fitur bersifat client-side dengan mock data lokal, tanpa backend terpisah.
