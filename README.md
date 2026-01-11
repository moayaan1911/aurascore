# 👨‍💻 About the Developer

<p align="center">
  <img src="https://gateway.lighthouse.storage/ipfs/bafybeidlpfu7vy2rgevvo2msiebtvjfjtejlgjsgjja4jixly45sq3woii/profile.jpeg" alt="Mohammad Ayaan Siddiqui" width="200" />
</p>

Assalamualaikum guys! 🙌 This is Mohammad Ayaan Siddiqui (♦moayaan.eth♦). I’m a **Full Stack Blockchain Developer** , **Crypto Investor** and **MBA in Blockchain Management** with **over 2 years of experience** rocking the Web3 world! 🚀 I’ve worn many hats:

- Research Intern at a Hong Kong-based firm 🇭🇰
- Technical Co-Founder at a Netherlands-based firm 🇳🇱
- Full Stack Intern at a Singapore-based crypto hardware wallet firm 🇸🇬
- Blockchain Developer at a US-based Bitcoin DeFi project 🇺🇸
- PG Diploma in Blockchain Management from Cambridge International Qualifications (CIQ) 🇬🇧
- MBA in Blockchain Management from University of Studies Guglielmo Marconi, Italy 🇮🇹

Let’s connect and build something epic! Find me at [moayaan.com](https://moayaan.com) 🌐

If you liked this project, please donate to Gaza 🇵🇸 [UNRWA Donation Link](https://donate.unrwa.org/-landing-page/en_EN)

Happy coding, fam! 😎✨

---

# AuraScore 🔮

> **Unlock Your Onchain Reputation**  
> Track your wallet's activity, DeFi engagement, transaction history, and cross-chain presence—all in one comprehensive score.

<a href="https://youtu.be/xnDc7OB0KZc?si=vpa1HbGpMG-UV5X5" target="_blank">
  <img src="https://img.shields.io/badge/Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo" height="30" />
</a>

---

## 🛠 How It Works

AuraScore analyzes your blockchain footprint to generate a personalized "Aura Score" and a comprehensive wallet report.

1.  **Input & Resolution**: Enter any Ethereum Wallet Address, ENS domain (e.g., `vitalik.eth`), or Unstoppable Domain. The app automatically resolves domains to their underlying addresses.
2.  **Data Aggregation**: We fetch real-time data across multiple chains using the **Moralis API**, including:
    - Transaction History & Volume
    - DeFi Positions & Protocol Usage
    - Token Holdings & Net Worth
    - Wallet Age & Activity Patterns
3.  **Score Calculation**: Our proprietary algorithm calculates your Aura Score based on factors like account longevity, diversity of assets, transaction frequency, and DeFi participation.
4.  **Visualization**: Your data is transformed into an interactive dashboard featuring:
    - **3D Backgrounds**: Immersive visual experience powered by Three.js.
    - **Activity Heatmap**: A GitHub-style contribution graph for your blockchain transactions.
    - **Financial Summary**: Clear breakdown of assets and net worth.
5.  **Share & Export**:
    - **Download Report**: Generate a detailed, colorful PDF report of your AuraScore.
    - **Share on X**: Post your score directly to Twitter with a custom-generated image card.

---

## ⚡ Tech Stack

Built with modern web technologies for performance and interactivity.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **3D Visuals**: [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Blockchain Data**: [Moralis API](https://moralis.io/)
- **Web3 Utilities**: [Ethers.js](https://docs.ethers.org/)
- **PDF Generation**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

---

## 🌟 Key Features

- **Interactive 3D UI**: A stunning, responsive interface with animated 3D backgrounds.
- **Multi-Input Support**: Works seamlessly with 0x addresses, ENS names, and Unstoppable Domains.
- **Smart Caching**: Implemented efficient caching (1-hour revalidation) to ensure fast load times and reduced API usage.
- **Rate Limiting**: Built-in protection against API abuse (2 requests/min per IP).
- **Social Integration**: One-click sharing to X (Twitter) and instant PDF report generation.
- **EVM Compatibility**: Supports major EVM-compatible chains.

---

## 🚀 Getting Started

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/moayaan1911/aurascore.git
    cd aura-score
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file and add your Moralis API Key:

    ```bash
    MORALIS_API_KEY=your_api_key_here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
