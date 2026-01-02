import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  chain: string;
  min_market_cap: number;
  one_week_price_percent_change_usd: number;
  one_day_price_percent_change_usd: number;
  one_month_volume_change_usd: number;
  security_score: number;
  one_month_price_percent_change_usd: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const {
      chain,
      min_market_cap,
      one_week_price_percent_change_usd,
      one_day_price_percent_change_usd,
      one_month_volume_change_usd,
      security_score,
      one_month_price_percent_change_usd,
    } = body;

    if (!chain) {
      return NextResponse.json(
        { error: "chain is required" },
        { status: 400 }
      );
    }

    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json(
        { error: "Moralis API key is not configured" },
        { status: 500 }
      );
    }

    const url = `https://deep-index.moralis.io/api/v2.2/discovery/tokens/blue-chip?chain=${chain}&min_market_cap=${min_market_cap}&one_week_price_percent_change_usd=${one_week_price_percent_change_usd}&one_day_price_percent_change_usd=${one_day_price_percent_change_usd}&one_month_volume_change_usd=${one_month_volume_change_usd}&security_score=${security_score}&one_month_price_percent_change_usd=${one_month_price_percent_change_usd}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch blue-chip tokens" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching blue-chip tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

