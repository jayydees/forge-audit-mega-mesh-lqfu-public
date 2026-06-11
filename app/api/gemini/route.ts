import { NextRequest, NextResponse } from 'next/server'

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { queries, productBrand, productTitle, keyAttributes } = body

    if (!Array.isArray(queries) || queries.length === 0) {
      return NextResponse.json({ success: false, error: 'No queries provided' }, { status: 400 })
    }

    const attrs = Array.isArray(keyAttributes) ? keyAttributes : []
    const brand = (productBrand ?? '').toLowerCase()
    const title = (productTitle ?? '').toLowerCase()

    const results: any[] = []

    for (let i = 0; i < queries.length; i++) {
      const q = queries[i]
      const queryText = q?.query ?? ''
      const queryType = q?.query_type ?? 'unknown'

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `I want to buy ${queryText}. What are the best options available in India? List specific product names and brands.` }]
              }]
            })
          }
        )

        if (!geminiRes.ok) {
          const errText = await geminiRes.text().catch(() => 'Unknown error')
          results.push({
            query: queryText,
            query_type: queryType,
            appeared: false,
            attribute_overlap_pct: 0,
            matched_attributes: [],
            competitors_mentioned: [],
            gemini_response_snippet: `API Error (${geminiRes.status}): ${errText.slice(0, 200)}`,
            error: true
          })
          if (i < queries.length - 1) await delay(200)
          continue
        }

        const geminiData = await geminiRes.json()
        const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const responseLower = responseText.toLowerCase()

        // Layer 1: Direct mention check
        const brandAppeared = brand.length > 0 && responseLower.includes(brand)
        const titleAppeared = title.length > 0 && responseLower.includes(title)
        const appeared = brandAppeared && titleAppeared

        // Layer 2: Attribute overlap
        const matchedAttributes: string[] = []
        for (const attr of attrs) {
          if (attr && responseLower.includes(attr.toLowerCase())) {
            matchedAttributes.push(attr)
          }
        }
        const attributeOverlapPct = attrs.length > 0
          ? Math.round((matchedAttributes.length / attrs.length) * 100)
          : 0

        // Competitors: Extract brand/product names that are NOT our brand
        const competitorsMentioned: string[] = []
        // Simple heuristic: look for capitalized words/phrases that look like brands
        const brandPattern = /\b([A-Z][a-zA-Z0-9]+(?:\s[A-Z][a-zA-Z0-9]+)*)\b/g
        const mentions = new Set<string>()
        let match
        while ((match = brandPattern.exec(responseText)) !== null) {
          const m = match[1]
          if (m.length > 2 && m.toLowerCase() !== brand && !['The', 'This', 'These', 'That', 'Those', 'What', 'Which', 'Where', 'When', 'Here', 'There', 'India', 'Amazon', 'Flipkart', 'Online', 'Best', 'Top', 'Buy', 'Price', 'Available', 'Key', 'Features', 'Pros', 'Cons', 'Yes', 'Product', 'Brand', 'Quality', 'Option', 'Options', 'Good', 'Great', 'Note', 'Overall', 'Some', 'How', 'Also', 'For', 'With', 'Not', 'And', 'But', 'Very', 'Most', 'More', 'All', 'Any', 'However', 'While', 'Important', 'Consider', 'Look', 'Check', 'Range', 'INR', 'LED', 'USB', 'Watt'].includes(m)) {
            mentions.add(m)
          }
        }
        competitorsMentioned.push(...Array.from(mentions).slice(0, 10))

        // Determine visibility_result: direct_mention, category_mention, or not_mentioned
        const visibilityResult = appeared ? 'direct_mention'
          : (brandAppeared || titleAppeared || attributeOverlapPct > 0) ? 'category_mention'
          : 'not_mentioned'

        results.push({
          query: queryText,
          query_type: queryType,
          appeared,
          visibility_result: visibilityResult,
          attribute_overlap_pct: attributeOverlapPct,
          matched_attributes: matchedAttributes,
          competitors_mentioned: competitorsMentioned,
          gemini_response_snippet: responseText.slice(0, 300)
        })
      } catch (err: any) {
        results.push({
          query: queryText,
          query_type: queryType,
          appeared: false,
          attribute_overlap_pct: 0,
          matched_attributes: [],
          competitors_mentioned: [],
          gemini_response_snippet: `Error: ${err?.message ?? 'Unknown'}`,
          error: true
        })
      }

      if (i < queries.length - 1) await delay(200)
    }

    // Build summary
    const appearedCount = results.filter(r => r.appeared).length
    const avgOverlap = results.length > 0
      ? Math.round(results.reduce((s, r) => s + (r.attribute_overlap_pct ?? 0), 0) / results.length)
      : 0

    // Top competitors
    const competitorCounts: Record<string, number> = {}
    for (const r of results) {
      if (Array.isArray(r.competitors_mentioned)) {
        for (const c of r.competitors_mentioned) {
          competitorCounts[c] = (competitorCounts[c] ?? 0) + 1
        }
      }
    }
    const topCompetitors = Object.entries(competitorCounts)
      .map(([brand, count]) => ({ brand, mention_count: count }))
      .sort((a, b) => b.mention_count - a.mention_count)
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      results,
      summary: {
        appeared_count: appearedCount,
        total_queries: results.length,
        avg_attribute_overlap: avgOverlap,
        ae_visibility_score: avgOverlap,
        top_competitors: topCompetitors
      }
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}
