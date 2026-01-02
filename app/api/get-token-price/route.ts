import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  tokenAddress: string;
  chain: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { tokenAddress, chain } = body;

    if (!tokenAddress || !chain) {
      return NextResponse.json(
        { error: "tokenAddress and chain are required" },
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

    const url = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress}/price?chain=${chain}&include=percent_change`;
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
        { error: `Failed to fetch token price for ${tokenAddress}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ usdPrice: data.usdPrice }, { status: 200 });
  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
