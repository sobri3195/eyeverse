# EYEVERSE AI

**Subtitle:** Platform 41 Teknologi AI Mata + 20 Teknologi Mata  
**Branding:** Created by Dr. Sobri

## Install & Run
```bash
npm install
npm run dev
```

## Build Production
```bash
npm run build
```

## Deploy ke Vercel
1. Push project ke GitHub.
2. Import repository di Vercel.
3. Pilih framework **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

## Struktur Data & Generator 5000+ Dataset
Generator data terpusat ada di:
- `src/utils/generateMockData.js`
- `src/data/generators/generatePatients.js`
- `src/data/generators/generateScans.js`
- `src/data/generators/generateReports.js`
- `src/data/generators/generateHistories.js`
- `src/data/generators/generateActivities.js`

Distribusi seed dataset:
- 2000 patients
- 1500 scans
- 800 reports
- 300 histories
- 200 activities
- 100 education articles
- 100 chatbot knowledge entries

Total seed: **5000 records** (minimal), semuanya dipakai oleh dashboard, analytics, reports, history, admin, education, chatbot, dan simulasi diagnosis.

## Fitur Utama
- 41 teknologi AI mata + 20 teknologi mata non-AI.
- Dashboard statistik real dari dataset.
- Analytics chart real dari dataset.
- Reports & History: search, filter, sort, pagination, detail, delete local item, export CSV/PDF.
- Diagnosis simulation rule-based (`simulateAnalysis` + `riskCalculator`).
- Upload simulasi image, chatbot berbasis knowledge dataset.
- Mock login/register/logout + protected routes.
- Theme toggle, toast, modal, tabs, loading/error/empty state.
- localStorage untuk session, theme, chat, laporan lokal, riwayat lokal, preferences.

