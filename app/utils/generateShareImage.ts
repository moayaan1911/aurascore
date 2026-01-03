/**
 * Generates a shareable image for Twitter/social media
 * Returns a blob URL that can be downloaded
 */
export async function generateShareImage(
  walletAddress: string,
  displayName: string,
  score: number,
  avatarUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas dimensions (Twitter optimal: 1200x675)
      canvas.width = 1200;
      canvas.height = 675;

      // Background gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#050807");
      gradient.addColorStop(0.5, "#0a0f0d");
      gradient.addColorStop(1, "#050807");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some decorative elements (circles)
      ctx.fillStyle = "rgba(0, 255, 136, 0.05)";
      ctx.beginPath();
      ctx.arc(100, 100, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(1100, 575, 200, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Load and draw avatar
      const avatarImg = new Image();
      avatarImg.crossOrigin = "anonymous";
      avatarImg.onload = () => {
        // Draw avatar (circular)
        ctx.save();
        ctx.beginPath();
        ctx.arc(600, 200, 80, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, 520, 120, 160, 160);
        ctx.restore();

        // Avatar border
        ctx.strokeStyle = "#00ff88";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(600, 200, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Display name
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 48px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(displayName, 600, 320);

        // Wallet address (if different from display name)
        if (
          displayName !==
          `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        ) {
          ctx.fillStyle = "#9ca3af";
          ctx.font = "24px 'Geist Mono', monospace";
          ctx.fillText(
            `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}`,
            600,
            360
          );
        }

        // Score label
        ctx.fillStyle = "#00ff88";
        ctx.font = "bold 32px 'Space Grotesk', sans-serif";
        ctx.fillText("My AuraScore", 600, 420);

        // Score value
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 120px 'Space Grotesk', sans-serif";
        ctx.fillText(score.toString(), 600, 540);

        // "/100" text
        ctx.fillStyle = "#9ca3af";
        ctx.font = "48px 'Space Grotesk', sans-serif";
        ctx.fillText("/100", 600, 590);

        // Footer text
        ctx.fillStyle = "#00ff88";
        ctx.font = "bold 28px 'Space Grotesk', sans-serif";
        ctx.fillText("Check your score at aurascore.vercel.app", 600, 640);

        // Convert canvas to blob URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error("Failed to create blob"));
          }
        }, "image/png");
      };

      avatarImg.onerror = () => {
        reject(new Error("Failed to load avatar image"));
      };

      avatarImg.src = avatarUrl;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Downloads the generated image
 */
export function downloadImage(blobUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Opens Twitter share dialog with pre-filled text (no image download)
 */
export function shareOnTwitter(score: number, displayName: string) {
  const text = `🎉 My AuraScore is ${score}/100! 🚀\n\nCheck your onchain reputation score now! 📊\n\n#AuraScore #Web3 #Crypto #OnchainAnalytics\n\nhttps://aurascore.vercel.app`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}`;
  window.open(twitterUrl, "_blank", "width=550,height=420");
}

/**
 * Generates and downloads the share image only
 */
export async function downloadShareImage(
  walletAddress: string,
  displayName: string,
  score: number,
  avatarUrl: string
): Promise<void> {
  const imageUrl = await generateShareImage(
    walletAddress,
    displayName,
    score,
    avatarUrl
  );
  downloadImage(
    imageUrl,
    `AuraScore_${displayName.replace(/[^a-zA-Z0-9]/g, "_")}.png`
  );
}
