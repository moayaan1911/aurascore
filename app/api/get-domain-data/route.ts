import { NextRequest, NextResponse } from "next/server";
import { isValidEthereumAddress } from "../../utils/validation";

interface RequestBody {
  walletAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    if (!isValidEthereumAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address format" },
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

    let ensDomain = null;
    let unstoppableDomain = null;

    // Fetch ENS domain
    try {
      const ensUrl = `https://deep-index.moralis.io/api/v2.2/resolve/${walletAddress}/reverse`;
      const ensResponse = await fetch(ensUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": moralisApiKey,
        },
        next: { revalidate: 3600 },
      });

      if (ensResponse.ok) {
        const ensData = await ensResponse.json();
        if (ensData && ensData.name) {
          ensDomain = ensData.name;
        }
      }
    } catch (ensError) {
      console.error("Error fetching ENS domain:", ensError);
    }

    // Fetch Unstoppable Domain
    try {
      const udUrl = `https://deep-index.moralis.io/api/v2.2/resolve/${walletAddress}/domain`;
      const udResponse = await fetch(udUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": moralisApiKey,
        },
        next: { revalidate: 3600 },
      });

      if (udResponse.ok) {
        const udData = await udResponse.json();
        if (udData && udData.name) {
          unstoppableDomain = udData.name;
        }
      }
    } catch (udError) {
      console.error("Error fetching Unstoppable Domain:", udError);
    }

    return NextResponse.json({ ensDomain, unstoppableDomain }, { status: 200 });
  } catch (error) {
    console.error("Error processing domain data:", error);
    return NextResponse.json(
      { ensDomain: null, unstoppableDomain: null },
      { status: 200 }
    );
  }
}
