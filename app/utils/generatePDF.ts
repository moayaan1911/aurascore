interface WalletSummaryData {
  ensDomain: string | null;
  unstoppableDomain: string | null;
  chainsTransacted: number;
  specificChains: string[];
  totalTransactions: number;
  highestChainTransactions: { chain: string; count: number };
  firstTransaction: { date: string; chain: string };
  walletAge: string;
  usdAtRisk: number;
  defiProtocols: { count: number; names: string[] };
  highestDefiPosition?: {
    type: string;
    protocol: string;
    token: string;
    amount: number;
  };
  totalNetWorth: {
    total: number;
    highestChain: { chain: string; amount: number };
  };
  totalGasFees: {
    total: number;
    highestChain: { chain: string; amount: number };
  };
  totalTrades: number;
  totalProfit: number;
}

type HeatmapItem = { date: string; count: number };

export async function generateAuraScorePDF(
  walletAddress: string,
  displayName: string,
  score: number,
  summaryData: WalletSummaryData,
  heatmapData: HeatmapItem[]
): Promise<void> {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdf = (await import("html2pdf.js")).default;

  const shortWallet = `${walletAddress.slice(0, 10)}...${walletAddress.slice(
    -8
  )}`;
  const showDisplayName =
    displayName !== `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  // Group heatmap data by month
  const monthlyData: Record<string, { counts: number[] }> = {};
  heatmapData.forEach((item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { counts: [] };
    }
    monthlyData[monthKey].counts.push(item.count);
  });

  const tableRows = Object.entries(monthlyData)
    .map(([month, data]) => {
      const totalTxs = data.counts.reduce((sum, count) => sum + count, 0);
      const avgTxs = (totalTxs / data.counts.length).toFixed(1);
      const maxTxs = Math.max(...data.counts);
      const activeDays = data.counts.filter((c) => c > 0).length;
      return `
        <tr>
          <td style="color: #00ff88; font-weight: bold;">${month}</td>
          <td>${totalTxs}</td>
          <td>${avgTxs}</td>
          <td>${maxTxs}</td>
          <td>${activeDays}/${data.counts.length}</td>
        </tr>
      `;
    })
    .join("");

  // Activity summary stats
  const totalYearTxs = heatmapData.reduce((sum, item) => sum + item.count, 0);
  const activeDaysTotal = heatmapData.filter((item) => item.count > 0).length;
  const maxDayTxs = Math.max(...heatmapData.map((item) => item.count));

  // Create HTML template
  const htmlContent = `
    <div id="pdf-content" style="font-family: 'Segoe UI', Arial, sans-serif; background: #050807; color: #fff; padding: 0; width: 210mm;">
      
      <!-- Page 1 -->
      <div style="padding: 20px; box-sizing: border-box; background: #050807;">
        <!-- Header -->
        <div style="display: flex; align-items: center; background: #0a0f0d; padding: 15px 20px; border-bottom: 2px solid #00ff88; margin-bottom: 20px;">
          <img src="/icon.png" style="width: 45px; height: 45px; margin-right: 15px; border-radius: 8px;" />
          <div style="flex: 1;">
            <div style="font-size: 22px; font-weight: bold; color: #00ff88;">AuraScore</div>
            <a href="https://moayaan.com" style="font-size: 10px; color: #9ca3af; text-decoration: underline;">Built by moayaan.eth</a>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="font-size: 9px; color: #fff;">Generated on ${new Date().toLocaleString()}</div>
          </div>
          <div style="font-size: 10px; color: #9ca3af;">Page 1 of 2</div>
        </div>

        <!-- Title Section -->
        <div style="background: #0a0f0d; border-radius: 10px; padding: 25px; margin-bottom: 20px; text-align: center; border: 1px solid #00aa55;">
          <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Wallet Analysis Report</div>
          <div style="font-size: 11px; color: #9ca3af; margin-bottom: 5px;">Wallet: ${shortWallet}</div>
          ${
            showDisplayName
              ? `<div style="font-size: 16px; font-weight: bold; color: #00ff88;">${displayName}</div>`
              : ""
          }
        </div>

        <!-- Score Section -->
        <div style="background: #0a0f0d; border-radius: 10px; padding: 15px 20px; margin-bottom: 15px; text-align: center; border: 2px solid #00ff88;">
          <div style="font-size: 13px; font-weight: bold; color: #00ff88; margin-bottom: 8px; text-align: left;">⚡ AuraScore</div>
          <div style="display: flex; align-items: baseline; justify-content: center;">
            <span style="font-size: 52px; font-weight: bold; color: #00ff88;">${score}</span>
            <span style="font-size: 20px; color: #fff; margin-left: 5px;">/100</span>
          </div>
        </div>

        <!-- Wallet Summary -->
        <div style="background: #0a0f0d; border-radius: 10px; padding: 15px; margin-bottom: 15px; border: 1px solid #00aa55;">
          <div style="font-size: 13px; font-weight: bold; color: #00ff88; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #00aa55;">📊 Wallet Summary</div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">🌐</span>
            <span style="color: #9ca3af; width: 130px;">Chains Transacted:</span>
            <span style="color: #fff; font-weight: bold;">${
              summaryData.chainsTransacted
            } (${summaryData.specificChains.slice(0, 5).join(", ")}${
    summaryData.specificChains.length > 5 ? "..." : ""
  })</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">📈</span>
            <span style="color: #9ca3af; width: 130px;">Total Transactions:</span>
            <span style="color: #fff; font-weight: bold;">${summaryData.totalTransactions.toLocaleString()}</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">🔥</span>
            <span style="color: #9ca3af; width: 130px;">Most Active Chain:</span>
            <span style="color: #00ff88; font-weight: bold;">${summaryData.highestChainTransactions.chain.toUpperCase()} (${
    summaryData.highestChainTransactions.count
  } txs)</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">📅</span>
            <span style="color: #9ca3af; width: 130px;">First Transaction:</span>
            <span style="color: #fff; font-weight: bold;">${
              summaryData.firstTransaction.date
            } on ${summaryData.firstTransaction.chain.toUpperCase()}</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">⏳</span>
            <span style="color: #9ca3af; width: 130px;">Wallet Age:</span>
            <span style="color: #fff; font-weight: bold;">${
              summaryData.walletAge
            }</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">⚠️</span>
            <span style="color: #9ca3af; width: 130px;">USD at Risk:</span>
            <span style="color: #00ff88; font-weight: bold;">$${summaryData.usdAtRisk.toFixed(
              2
            )}</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">🏦</span>
            <span style="color: #9ca3af; width: 130px;">DeFi Protocols:</span>
            <span style="color: #fff; font-weight: bold;">${
              summaryData.defiProtocols.count
            } (${summaryData.defiProtocols.names.slice(0, 4).join(", ")}${
    summaryData.defiProtocols.names.length > 4 ? "..." : ""
  })</span>
          </div>
          
          ${
            summaryData.highestDefiPosition
              ? `
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">💎</span>
            <span style="color: #9ca3af; width: 130px;">Top DeFi Position:</span>
            <span style="color: #00ff88; font-weight: bold;">${
              summaryData.highestDefiPosition.type
            } on ${
                  summaryData.highestDefiPosition.protocol
                } ($${summaryData.highestDefiPosition.amount.toFixed(2)})</span>
          </div>
          `
              : ""
          }
        </div>

        <!-- Financial Summary -->
        <div style="background: #0a0f0d; border-radius: 10px; padding: 15px; margin-bottom: 15px; border: 1px solid #00aa55;">
          <div style="font-size: 13px; font-weight: bold; color: #00ff88; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #00aa55;">💰 Financial Summary</div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">💵</span>
            <span style="color: #9ca3af; width: 130px;">Total Net Worth:</span>
            <span style="color: #00ff88; font-weight: bold;">$${summaryData.totalNetWorth.total.toFixed(
              2
            )}</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">🏆</span>
            <span style="color: #9ca3af; width: 130px;">Highest Worth Chain:</span>
            <span style="color: #fff; font-weight: bold;">${
              summaryData.totalNetWorth.highestChain.chain
            } ($${summaryData.totalNetWorth.highestChain.amount.toFixed(
    2
  )})</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">⛽</span>
            <span style="color: #9ca3af; width: 130px;">Total Gas Fees:</span>
            <span style="color: #fff; font-weight: bold;">$${summaryData.totalGasFees.total.toFixed(
              2
            )}</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">📊</span>
            <span style="color: #9ca3af; width: 130px;">Total Trades:</span>
            <span style="color: #fff; font-weight: bold;">${
              summaryData.totalTrades
            }</span>
          </div>
          
          <div style="display: flex; margin-bottom: 6px; font-size: 9px;">
            <span style="color: #00ff88; width: 22px; font-weight: bold;">📈</span>
            <span style="color: #9ca3af; width: 130px;">Total Profit:</span>
            <span style="color: ${
              summaryData.totalProfit > 0 ? "#00ff88" : "#fff"
            }; font-weight: bold;">$${summaryData.totalProfit.toFixed(2)}</span>
          </div>
        </div>

      </div>

      <!-- Page 2 -->
      <div style="min-height: 297mm; padding: 20px; box-sizing: border-box; page-break-before: always; background: #050807;">
        <!-- Header -->
        <div style="display: flex; align-items: center; background: #0a0f0d; padding: 15px 20px; border-bottom: 2px solid #00ff88; margin-bottom: 20px;">
          <img src="/icon.png" style="width: 45px; height: 45px; margin-right: 15px; border-radius: 8px;" />
          <div style="flex: 1;">
            <div style="font-size: 22px; font-weight: bold; color: #00ff88;">AuraScore</div>
            <a href="https://moayaan.com" style="font-size: 10px; color: #9ca3af; text-decoration: underline;">Built by moayaan.eth</a>
          </div>
          <div style="text-align: center; flex: 1;">
            <div style="font-size: 9px; color: #fff;">Generated on ${new Date().toLocaleString()}</div>
          </div>
          <div style="font-size: 10px; color: #9ca3af;">Page 2 of 2</div>
        </div>

        <!-- Heatmap Table -->
        <div style="background: #0a0f0d; border-radius: 10px; padding: 20px; margin-bottom: 20px; border: 1px solid #00aa55;">
          <div style="font-size: 14px; font-weight: bold; color: #00ff88; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #00aa55;">🔥 Transaction Heatmap (Last 365 Days)</div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background: #00ff88; color: #000;">
                <th style="padding: 10px; text-align: left; font-weight: bold;">Month</th>
                <th style="padding: 10px; text-align: center; font-weight: bold;">Total Txs</th>
                <th style="padding: 10px; text-align: center; font-weight: bold;">Avg/Day</th>
                <th style="padding: 10px; text-align: center; font-weight: bold;">Max/Day</th>
                <th style="padding: 10px; text-align: center; font-weight: bold;">Active Days</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <!-- Activity Summary -->
        <div style="background: #0a0f0d; border-radius: 10px; padding: 20px; border: 2px solid #00ff88;">
          <div style="font-size: 14px; font-weight: bold; color: #00ff88; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #00aa55;">📊 Yearly Activity Summary</div>
          
          <div style="display: flex; margin-bottom: 8px;">
            <span style="color: #9ca3af; width: 200px;">Total Transactions (365 days):</span>
            <span style="color: #fff; font-weight: bold;">${totalYearTxs.toLocaleString()}</span>
          </div>
          
          <div style="display: flex; margin-bottom: 8px;">
            <span style="color: #9ca3af; width: 200px;">Active Days:</span>
            <span style="color: #fff; font-weight: bold;">${activeDaysTotal}/365 (${(
    (activeDaysTotal / 365) *
    100
  ).toFixed(1)}%)</span>
          </div>
          
          <div style="display: flex; margin-bottom: 8px;">
            <span style="color: #9ca3af; width: 200px;">Most Active Day:</span>
            <span style="color: #00ff88; font-weight: bold;">${maxDayTxs} transactions</span>
          </div>
        </div>

      </div>
    </div>
  `;

  // Create a temporary container
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  const element = container.querySelector("#pdf-content") as HTMLElement;

  if (!element) {
    document.body.removeChild(container);
    throw new Error("PDF content element not found");
  }

  // Configure html2pdf options
  const options = {
    margin: 0,
    filename: `AuraScore_${displayName.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_${Date.now()}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#050807",
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
    pagebreak: { mode: ["css", "legacy"] as const },
  };

  try {
    await html2pdf().set(options).from(element).save();
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}
