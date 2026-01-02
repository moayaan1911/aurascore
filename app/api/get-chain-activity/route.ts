import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  walletAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: RequestBody = await request.json();
    const { walletAddress } = body;

    // Validate that address is provided
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Get the Moralis API key from environment variables
    const moralisApiKey = process.env.MORALIS_API_KEY;
    if (!moralisApiKey) {
      return NextResponse.json(
        { error: "Moralis API key is not configured" },
        { status: 500 }
      );
    }

    // Call the Moralis API
    const moralisUrl = `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/chains?chains%5B0%5D=eth&chains%5B1%5D=polygon&chains%5B2%5D=base&chains%5B3%5D=bsc&chains%5B4%5D=avalanche&chains%5B5%5D=optimism&chains%5B6%5D=arbitrum&chains%5B7%5D=gnosis&chains%5B8%5D=linea`;
    const response = await fetch(moralisUrl, {
      method: "GET",
      headers: {
        "X-API-Key": moralisApiKey,
      },
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Moralis API error:", errorData);
      return NextResponse.json(
        { error: `Moralis API error: ${errorData.message || "Unknown error"}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching chain activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
