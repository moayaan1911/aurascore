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
    console.log("Resolving Unstoppable domain:", domain, "URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    });

    // If domain not found or any error from Moralis, return null address (not an error)
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: "Unknown error" };
      }
      console.log(
        "Moralis API response status:",
        response.status,
        "Error:",
        errorData
      );

      // Return null address for 404 (not found) - this is expected for non-existent domains
      if (response.status === 404) {
        return NextResponse.json({ address: null }, { status: 200 });
      }

      // For other errors, still return success but with null
      return NextResponse.json({ address: null }, { status: 200 });
    }

    const data = await response.json();
    console.log("Unstoppable domain resolution success:", data);
    return NextResponse.json(
      { address: data.address || null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resolving Unstoppable domain:", error);
    // Even on error, return null instead of 500 to let frontend handle it gracefully
    return NextResponse.json({ address: null }, { status: 200 });
  }
}
