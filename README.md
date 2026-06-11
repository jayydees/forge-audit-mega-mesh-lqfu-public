# Forge Audit — Multi-Agent Amazon Listing Audit (Early Build)

> **Note:** this is an earlier development snapshot of what became [Data Quality Sentinel](https://github.com/jayydees/Lyzr-Data-quality-sentinel-original-public). Same architecture, same agent mesh — kept public because the build history of a multi-agent system is half the lesson.

**The problem:** Amazon sellers optimize listings for keyword search, but buyers increasingly shop by *asking AI* — Rufus, Gemini, ChatGPT. A listing that ranks fine in search can be completely invisible to an answer engine, and sellers have no way to even know.

This build is where I worked out the answer: a **six-agent audit pipeline** on Lyzr that takes Amazon product URLs and produces an AI Readiness Score.

## The agent mesh

1. **Defect Hunter** — compliance and structural defects (title violations, keyword stuffing, attribute pollution, suppression risk)
2. **Discovery Agent** — simulates 10 shopper-intent queries and grades match quality
3. **AE Visibility Agent** — generates Gemini-style shopping queries for the product's category
4. **Live Gemini testing** — runs those queries against the real Gemini API and checks whether the brand/attributes actually appear in answers
5. **Competitor Gap Agent** — extracts attributes and keywords 2–3 competitors surface that this listing doesn't
6. **Rewrite Agent** — optimized title/bullets/description with change tracking
7. **QA Auditor** — cross-examines all outputs, flags inter-agent conflicts, scores confidence per recommendation, routes <70% confidence to human review, and computes the final score

The thing I was really testing in this build: **can a QA-auditor agent make a multi-agent system trustworthy?** Agents contradict each other constantly. Surfacing those conflicts with confidence scores — instead of silently picking a winner — turned out to be the design that works.

## Run it

```bash
npm install
cp .env.example .env.local
# LYZR_API_KEY=     → lyzr.ai
# GEMINI_API_KEY=   → aistudio.google.com
# APIFY_TOKEN=      → console.apify.com
npm run dev         # http://localhost:3333
```

Or click **Demo** in the UI for a fully pre-cached audit run — no API keys needed to explore.

## Stack

Next.js 14, shadcn/ui, Lyzr agents (structured JSON schemas in `response_schemas/`), Apify Amazon crawler, Gemini 2.5 Flash Lite. The full agent topology is in `workflow.json`.

---

Built by [@jayydees](https://github.com/jayydees). See [Data Quality Sentinel](https://github.com/jayydees/Lyzr-Data-quality-sentinel-original-public) for the refined version.
