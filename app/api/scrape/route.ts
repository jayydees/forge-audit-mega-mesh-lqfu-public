import { NextRequest, NextResponse } from 'next/server'

const APIFY_TOKEN = process.env.APIFY_TOKEN

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productUrls } = body

    if (!Array.isArray(productUrls) || productUrls.length === 0) {
      return NextResponse.json({ success: false, error: 'No product URLs provided' }, { status: 400 })
    }

    const apifyBody = {
      categoryOrProductUrls: productUrls.map((u: string) => ({ url: u })),
      maxItemsPerStartUrl: 1,
      ensureLoadedProductDescriptionFields: true,
      useCaptchaSolver: false,
      scrapeProductDetails: true,
      language: "en",
      proxyCountry: "AUTO_SELECT_PROXY_COUNTRY",
      locationDeliverableRoutes: ["PRODUCT"]
    }

    const res = await fetch(
      `https://api.apify.com/v2/acts/junglee~amazon-crawler/run-sync-get-dataset-items?token=${APIFY_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apifyBody) }
    )

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      return NextResponse.json({ success: false, error: `Apify API error (${res.status}): ${errText.slice(0, 200)}` }, { status: res.status })
    }

    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ success: false, error: 'Apify returned no product data. Check your URLs.' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? 'Internal server error' }, { status: 500 })
  }
}
