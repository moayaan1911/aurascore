import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  domain: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "domain is required" },
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

    const url = `https://deep-index.moralis.io/api/v2.2/resolve/${domain}?currency=eth`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Moralis API error:", errorData);
      return NextResponse.json(
        { error: "Failed to resolve Unstoppable domain" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      { address: data.address || null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resolving Unstoppable domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
