import { NextRequest, NextResponse } from "next/server";
import { isValidEthereumAddress } from "../../utils/validation";

interface RequestBody {
  walletAddress: string;
  chains: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { walletAddress, chains } = body;

    if (!walletAddress || !chains || !Array.isArray(chains)) {
      return NextResponse.json(
        { error: "walletAddress and chains array are required" },
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

    const chainQuery = chains.map((chain) => `chains%5B%5D=${chain}`).join("&");
    const url = `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/net-worth?${chainQuery}&exclude_spam=true&exclude_unverified_contracts=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Moralis API error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch wallet net worth" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching wallet net worth:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
