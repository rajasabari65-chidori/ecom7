import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. Opti Assistant Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System instruction with domain rules and real catalog context
  const systemInstruction = `You are Opti Assistant, the intelligent commerce copilot of OptiMart AI ("Shop Smarter. Sell Better. Waste Less.").
You assist customers with finding deals, comparing specs, staying under budget, and discovering surplus discounts.
You assist sellers with inventory turnover, clearance pricing, and demand risks.
Always refer to amounts in Indian Rupees (₹).
Keep answers crisp, actionable, professional, and friendly.
Relevant Context:
${JSON.stringify(context || {}, null, 2)}
`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I analyzed your request, but could not generate a response.';
      return res.json({ reply, poweredBy: 'Gemini 3.8 Flash' });
    } catch (error: any) {
      console.warn('Gemini chat failed, falling back to deterministic response:', error?.message);
    }
  }

  // Fallback rule-based smart assistant
  const lower = message.toLowerCase();
  let fallbackReply = "I'm Opti Assistant! I can help you evaluate Price Guardian deals, discover verified surplus discounts, or optimize your cart to stay strictly within your budget. What product or category are you looking for today?";

  if (lower.includes('headphone') || lower.includes('audio') || lower.includes('earbuds')) {
    fallbackReply = "For premium audio, check out the **Acoustiq Max Pro Wireless Headphones** (current price ₹17,499, marked down from ₹24,999 - 30% surplus clearance). If you need an ultralight budget alternative under ₹2,500, the **PulseFlow Neo Earbuds** at ₹2,299 offer 30dB ANC and 28 hours battery.";
  } else if (lower.includes('laptop') || lower.includes('computer') || lower.includes('mac') || lower.includes('novabook')) {
    fallbackReply = "The **NovaBook Pro 14 OLED Ultrabook** is our featured lightweight flagship at ₹84,999 (down from ₹1,14,999 with 32GB RAM & 2.8K 120Hz display). It's rated 4.85/5 by verified tech buyers.";
  } else if (lower.includes('watch') || lower.includes('smartwatch') || lower.includes('fitness')) {
    fallbackReply = "We feature the **Atlas Chrono Ultra Titanium Smartwatch** at ₹28,999 (Grade 5 Titanium, 100m water resistance, 14-day battery). For budget fitness tracking, the **StrideCore Track 4 Band** is just ₹1,899 (52% off surplus deal).";
  } else if (lower.includes('budget') || lower.includes('cart') || lower.includes('save') || lower.includes('cheap')) {
    fallbackReply = "Our **AI Smart Cart Optimizer** automatically detects when your cart exceeds your preset limit and recommends equivalent surplus items with similar specifications to save you an average of 25% to 40%!";
  } else if (lower.includes('surplus') || lower.includes('waste') || lower.includes('sell')) {
    fallbackReply = "OptiMart AI matches excess business inventory directly with value-conscious shoppers. Sellers liquidate aging stock before depreciation, and buyers get authentic brand-new or certified open-box hardware at steep factory discounts!";
  }

  return res.json({ reply: fallbackReply, poweredBy: 'Deterministic Intelligence (Gemini Ready)' });
});

// 2. Price Guardian Deep Evaluation Endpoint
app.post('/api/gemini/price-guardian', async (req, res) => {
  const { product } = req.body;
  if (!product) {
    return res.status(400).json({ error: 'Product is required' });
  }

  const currentPrice = Number(product.currentPrice);
  const originalPrice = Number(product.originalPrice);
  const priceHistory = product.priceHistory || [];
  const prices = priceHistory.map((p: any) => p.price);
  const minPrice = prices.length ? Math.min(...prices) : currentPrice;
  const maxPrice = prices.length ? Math.max(...prices) : originalPrice;
  const avgPrice = prices.length ? Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length) : currentPrice;

  // AI-enhanced rationale
  let dealScore = 75;
  let verdict: 'GOOD DEAL' | 'FAIR PRICE' | 'CONSIDER WAITING' | 'COMPARE ALTERNATIVES' = 'GOOD DEAL';
  let explanation = '';

  if (currentPrice <= minPrice) {
    dealScore = 95;
    verdict = 'GOOD DEAL';
    explanation = `Currently at its lowest recorded price in available historical data (₹${currentPrice.toLocaleString('en-IN')}). Discount of ${product.discountPercentage}% from original MRP provides superior purchase value.`;
  } else if (currentPrice < avgPrice) {
    dealScore = 82;
    verdict = 'GOOD DEAL';
    explanation = `Priced ${Math.round(((avgPrice - currentPrice) / avgPrice) * 100)}% below the 6-month historical average of ₹${avgPrice.toLocaleString('en-IN')}. Consistent positive price trend indicates high value-to-cost ratio.`;
  } else if (currentPrice === avgPrice) {
    dealScore = 65;
    verdict = 'FAIR PRICE';
    explanation = `Trading in line with its medium-term baseline price. Fair price for immediate purchase, though historical clearance dips have occurred.`;
  } else {
    dealScore = 48;
    verdict = 'CONSIDER WAITING';
    explanation = `Current price is close to the recorded maximum of ₹${maxPrice.toLocaleString('en-IN')}. Historical surplus cycles suggest potential markdown in upcoming inventory reviews.`;
  }

  if (aiClient) {
    try {
      const prompt = `Analyze this product pricing data for OptiMart Price Guardian:
Product: ${product.name}
Current Price: ₹${currentPrice}
Original Price: ₹${originalPrice}
Lowest Historical: ₹${minPrice}
Average Historical: ₹${avgPrice}
Highest Historical: ₹${maxPrice}
Discount: ${product.discountPercentage}%
Condition: ${product.condition}

Return a concise 2-sentence objective explanation and evaluation.`;

      const aiRes = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (aiRes.text) {
        explanation = aiRes.text.trim();
      }
    } catch (e) {
      // Keep deterministic explanation
    }
  }

  return res.json({
    dealScore,
    verdict,
    explanation,
    lowestPriceRecorded: minPrice,
    averagePrice: avgPrice,
    highestPriceRecorded: maxPrice,
    confidence: prices.length >= 4 ? 'HIGH' : 'MEDIUM',
  });
});

// 3. AI Surplus & Pricing Assistant for Sellers
app.post('/api/gemini/surplus-analysis', async (req, res) => {
  const { product } = req.body;
  if (!product) {
    return res.status(400).json({ error: 'Product is required' });
  }

  const stock = Number(product.stock || 0);
  const monthlyDemand = Number(product.expectedMonthlyDemand || 15);
  const daysSupply = Math.round((stock / Math.max(1, monthlyDemand)) * 30);
  const excessStock = Math.max(0, stock - monthlyDemand);
  const currentPrice = Number(product.currentPrice);
  const costPrice = Number(product.costPrice || currentPrice * 0.7);
  const minAcceptablePrice = Number(product.minAcceptablePrice || costPrice * 1.1);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let suggestedDiscount = product.discountPercentage;
  let suggestedPrice = currentPrice;

  if (daysSupply > 90) {
    riskLevel = 'CRITICAL';
    suggestedDiscount = Math.min(60, product.discountPercentage + 15);
    suggestedPrice = Math.max(minAcceptablePrice, Math.round(currentPrice * 0.85));
  } else if (daysSupply > 60) {
    riskLevel = 'HIGH';
    suggestedDiscount = Math.min(50, product.discountPercentage + 10);
    suggestedPrice = Math.max(minAcceptablePrice, Math.round(currentPrice * 0.9));
  } else if (daysSupply > 45) {
    riskLevel = 'MEDIUM';
    suggestedDiscount = Math.min(40, product.discountPercentage + 5);
    suggestedPrice = Math.max(minAcceptablePrice, Math.round(currentPrice * 0.95));
  }

  const clearanceDaysEstimate = Math.round((excessStock / (monthlyDemand * 1.3)) * 30);
  const estimatedFinancialRecovery = Math.round(excessStock * suggestedPrice);

  let explanation = `Inventory level of ${stock} units represents ~${daysSupply} days of forward cover compared to average velocity of ${monthlyDemand} units/month. Recommended markdown to ₹${suggestedPrice.toLocaleString('en-IN')} remains safely above your minimum floor price (₹${minAcceptablePrice.toLocaleString('en-IN')}) while accelerating capital turnover.`;

  return res.json({
    productId: product.id,
    productName: product.name,
    currentStock: stock,
    expectedDemand: monthlyDemand,
    excessStock,
    riskLevel,
    currentPrice,
    suggestedPrice,
    recommendedDiscount: suggestedDiscount,
    clearanceDaysEstimate: Math.max(14, clearanceDaysEstimate),
    estimatedFinancialRecovery,
    explanation,
  });
});

// Setup Vite in Dev or serve static in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OptiMart AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
