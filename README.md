# ResumeMatch AI — HR Intelligence Dashboard

An AI-powered resume screening tool built with **Next.js 15**, **Tailwind CSS**, **shadcn/ui**, and the **Vercel AI SDK**. Upload a resume PDF and a job description to instantly get a structured match analysis powered by GPT-4o.

![ResumeMatch AI Dashboard](./public/preview.png)

---

## ✨ Features

- **Drag-and-drop PDF upload** with file validation and preview
- **AI-powered match scoring** (0–100) with animated circular progress ring
- **Structured gap analysis** — matching skills vs. missing skills
- **Hiring recommendation** — Strong Hire / Consider / Pass
- **Experience alignment** evaluation
- **Professional verdict** in plain language
- Built with shadcn/ui components for a polished HR dashboard look

---

## 🏗️ Architecture

```
app/
  actions/match.ts      ← Server Action: PDF parsing + AI analysis
  globals.css           ← Design tokens, custom animations
  layout.tsx            ← Root layout
  page.tsx              ← Main dashboard page (Client Component)

components/
  ui/                   ← shadcn/ui base components (Button, Card, Textarea, Separator)
  resume-upload.tsx     ← Drag-and-drop file upload
  results-card.tsx      ← Analysis results display
  score-ring.tsx        ← Animated SVG circular score ring

lib/
  utils.ts              ← cn() utility for Tailwind class merging
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧠 How It Works

1. **User uploads** a PDF resume and pastes a job description
2. A **Next.js 15 Server Action** (`app/actions/match.ts`) handles the form data
3. **`pdf-parse`** extracts clean text from the PDF buffer
4. **`generateObject`** from the Vercel AI SDK calls GPT-4o with a **Zod schema**, enforcing a structured JSON response:

```typescript
{
  match_score: number,           // 0–100
  matching_skills: string[],     // Skills found in both resume & JD
  missing_skills: string[],      // JD skills absent from resume
  verdict: string,               // 2-3 sentence assessment
  experience_alignment: "Strong" | "Moderate" | "Weak",
  recommendation: "Strong Hire" | "Consider" | "Pass"
}
```

5. The client renders an **animated results card** with the score ring, skill badges, and verdict.

---

## 🎨 Design Decisions

- **Fraunces** (serif) as display font — editorial, refined feel appropriate for professional HR tools
- **DM Sans** as body font — legible, modern sans-serif
- Neutral light theme with `hsl` CSS variables for easy theming
- SVG `stroke-dashoffset` animation for the score ring (no external library needed)
- Staggered `animation-delay` on result items for a polished reveal

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `next` 15 | App Router, Server Actions |
| `ai` (Vercel AI SDK) | `generateObject` with structured output |
| `@ai-sdk/openai` | OpenAI provider for the AI SDK |
| `pdf-parse` | Extract text from PDF buffers |
| `zod` | Schema validation for AI output |
| `tailwindcss` | Utility-first CSS |
| `shadcn/ui` (via Radix) | Accessible component primitives |
| `lucide-react` | Icon set |

---

## 🔐 Security Notes

- PDF parsing happens **server-side only** — raw file bytes never leave the server action
- The OpenAI API key is accessed via `process.env` and never exposed to the client
- File size is limited to 10 MB via `next.config.mjs` `serverActions.bodySizeLimit`

---

## 📄 License

MIT
