<div align="center">

# 🚀 RankLab

### The Open-Source JEE Intelligence Platform

**Browse 23 years of JEE Main questions. Explore concepts. Understand which NCERT sections actually matter.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## ✨ What is RankLab?

RankLab is a **free, open-source JEE preparation intelligence tool** built for students who want data-driven insights — not just a question dump.

It transforms 23 years of JEE Main papers into an explorable, searchable knowledge base, linking every question to the exact NCERT sections it tests using **vector similarity search** across 44,000+ embeddings.

> **Want to build the data pipeline yourself or access the raw data?**
> Check out the companion repo: [**edtech_analysis_pipeline**](https://github.com/sahil28123/edtech_analysis_pipeline) — a full Python pipeline that extracts, structures (via Gemini AI), embeds, and uploads JEE + NCERT data to Supabase.

---

## 🎯 Features

| Feature | Description |
|--------|-------------|
| 📚 **Question Bank** | Search & filter 23 years of JEE Main questions by subject, difficulty, type, and year |
| 🧠 **Concept Explorer** | Browse 300+ JEE concepts with formulas, key points, common mistakes, and exam tips |
| 🔥 **Topic Trends** | See which topics appear most across papers — focus your energy where it counts |
| 📖 **NCERT Insights** | Discover which NCERT sections have the highest JEE question density |
| 📊 **Chapter Analysis** | Difficulty breakdown (Easy / Medium / Hard) for every chapter across all subjects |
| 🔗 **NCERT ↔ JEE Links** | Each question links back to the NCERT paragraphs it directly tests (vector similarity) |
| ⚡ **Concept Graph** | "Learn First" prerequisites and "This Unlocks" connections for every concept |

---

## 🖼️ Screenshots

> The interface is designed to be friendly, colorful, and easy to use for students of all ages.

| Dashboard | Practice Questions | Concept Detail |
|-----------|-------------------|----------------|
| Explore all your stats at a glance | Filter by subject, difficulty, year & type | Formulas, key points, mistakes & linked questions |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Nunito font
- **Database:** [Supabase](https://supabase.com) (PostgreSQL + pgvector)
- **Icons:** [Lucide React](https://lucide.dev)
- **Charts:** [Recharts](https://recharts.org)
- **AI/Embeddings:** Google `text-embedding-004` (768-dim vectors, handled by the pipeline)

---

## 🗄️ Database Schema (High Level)

The app reads from a Supabase database populated by the [data pipeline](https://github.com/sahil28123/edtech_analysis_pipeline).

```
questions              — every JEE Main question (2002–2025)
  └── subject, chapter, topic, difficulty, year, shift
  └── concepts[], formulas[], question_type, ncert_reference
  └── embedding (768-dim vector)

concept_nodes          — 300+ JEE concepts with metadata
  └── formulas, key_points, common_mistakes, jee_tip
  └── jee_count, pct_hard, estimated_time_min

concept_edges          — prerequisite / enables relationships between concepts

ncert_chunks           — NCERT Class 11 & 12 sections (Physics + Chemistry)
  └── section_num, section_title, paragraph, embedding

question_ncert_links   — cosine similarity links between questions and NCERT sections
  └── similarity score for each JEE question ↔ NCERT paragraph pair

ncert_importance       — aggregated view: which NCERT sections have the most JEE coverage
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org)
- A [Supabase](https://supabase.com) project (free tier works)
- The populated database — see the [data pipeline repo](https://github.com/sahil28123/edtech_analysis_pipeline) to build it yourself

### 1. Clone the repo

```bash
git clone https://github.com/sahil28123/ranklab.git
cd ranklab
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in your Supabase project under **Settings → API**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're live! 🎉

---

## 📦 Building for Production

```bash
npm run build
npm run start
```

Or deploy instantly on [Vercel](https://vercel.com) — it's what Next.js is built for:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🔧 Project Structure

```
ranklab/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard (home)
│   │   ├── questions/
│   │   │   ├── page.tsx          # Question bank with filters
│   │   │   └── [id]/page.tsx     # Question detail with NCERT links
│   │   ├── concepts/
│   │   │   ├── page.tsx          # Concept explorer
│   │   │   └── [id]/page.tsx     # Concept detail (formulas, graph)
│   │   ├── topics/page.tsx       # Topic frequency analysis
│   │   ├── ncert/page.tsx        # NCERT section importance
│   │   └── chapters/page.tsx     # Chapter difficulty breakdown
│   ├── components/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── StatCard.tsx          # Dashboard stat cards
│   │   ├── DifficultyBadge.tsx   # Easy / Medium / Hard badge
│   │   ├── SubjectBadge.tsx      # Physics / Chemistry / Maths badge
│   │   ├── SearchBar.tsx         # Live search component
│   │   └── YearSelect.tsx        # Year filter dropdown
│   └── lib/
│       ├── supabase.ts           # Supabase client
│       └── utils.ts              # Color tokens, helpers
├── tailwind.config.ts
└── package.json
```

---

## 🤝 Want the Data Pipeline?

RankLab reads from a Supabase database. To populate it from scratch (i.e., process raw JEE PDFs and NCERT books yourself), head over to:

### 👉 [edtech_analysis_pipeline](https://github.com/sahil28123/edtech_analysis_pipeline)

The pipeline:
- Extracts text from **100+ JEE Main PDFs** (2021–2025)
- Uses **Gemini AI** to classify and tag every question
- Generates **768-dimensional embeddings** for each question and NCERT paragraph
- Computes **cosine similarity** to link questions ↔ NCERT sections
- Uploads everything to Supabase with a clean schema

It handles Physics, Chemistry, and Mathematics across Class 11 & 12 NCERT textbooks.

---

## 🙌 Contributing

Contributions are very welcome! Here's how to get started:

1. **Fork** this repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "feat: add xyz"`
4. Push: `git push origin feature/your-feature`
5. Open a **Pull Request**

### Ideas for contribution

- [ ] Add a student progress / bookmark system
- [ ] Add a full-text search with ranking
- [ ] Dark mode support
- [ ] Mobile app (React Native)
- [ ] More years of JEE Advanced data
- [ ] Formula renderer (KaTeX / MathJax)
- [ ] AI tutor chatbot using the existing embeddings

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with ❤️ for JEE students everywhere.

**[⭐ Star this repo](https://github.com/sahil28123/ranklab)** if RankLab helped you!

</div>
