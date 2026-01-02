import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  walletAddress: string;
  chain: string;
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();
  const { walletAddress, chain } = body;

  if (!walletAddress || !chain) {
    return NextResponse.json(
      { error: "walletAddress and chain are required" },
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

  const url = `https://deep-index.moralis.io/api/v2.2/wallets/${walletAddress}/history?chain=${chain}&order=DESC`;
  let totalTransactionFees = 0;
  const allTimestamps: string[] = [];
  let cursor: string | null = null;

  try {
    do {
      const response: Response = await fetch(
        `${url}${cursor ? `&cursor=${cursor}` : ""}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-API-Key": moralisApiKey,
          },
        }
      );

      const data: {
        result?: Array<{
          transaction_fee?: string | number;
          from_address: string;
          block_timestamp: string;
        }>;
        cursor?: string | null;
      } = await response.json();
      const transactions = data.result || [];

      // Sum transaction fees where from_address matches the wallet address
      transactions.forEach((transaction) => {
        const transactionFee = parseFloat(
          String(transaction.transaction_fee || 0)
        );
        if (
          transaction.from_address.toLowerCase() === walletAddress.toLowerCase()
        ) {
          totalTransactionFees += isNaN(transactionFee) ? 0 : transactionFee;
          allTimestamps.push(transaction.block_timestamp); // Collect timestamps
        }
      });

      cursor = data.cursor || null; // Get next cursor, if available
    } while (cursor);

    totalTransactionFees = isNaN(totalTransactionFees)
      ? 0
      : totalTransactionFees;

    return NextResponse.json({ totalTransactionFees, allTimestamps });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction history" },
      { status: 500 }
    );
  }
}
