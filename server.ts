import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to safely get Gemini instance
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Intelligent Financial Knowledge Engine for offline/fallback mode
function generateSmartFinancialResponse(userMsg: string, financialContext: string, currency: string = '₹'): string {
  const query = userMsg.toLowerCase();

  // Stock Market & Equities
  if (query.includes('stock') || query.includes('market') || query.includes('share') || query.includes('equity') || query.includes('nifty') || query.includes('sensex') || query.includes('s&p') || query.includes('nasdaq')) {
    return `📈 **Stock Market Overview & Financial Strategy**:
The stock market is a dynamic platform where shares of publicly traded companies are bought and sold.

• **Market Index Tracking**: Major market benchmarks (such as the S&P 500, Nifty 50, Nasdaq, or Sensex) track overall economic performance and long-term corporate growth.
• **Long-Term Equity Growth**: Broad market index funds historically yield 10-12% annualized long-term returns, outperforming traditional savings accounts.
• **Dollar-Cost Averaging (SIP)**: Rather than trying to time market highs and lows, invest fixed amounts regularly (monthly or weekly) to smooth out volatility.
• **Core Strategy for Beginners**: Focus on low-cost index funds or ETFs rather than individual stock picking.
• **Risk Management**: Maintain a balanced portfolio between equities, fixed income, and a liquid 3-6 month emergency fund.

💡 *FinBot Tip*: Ensure your emergency reserves are fully established before allocating funds into stock market equities.`;
  }

  // Investing & Mutual Funds
  if (query.includes('invest') || query.includes('fund') || query.includes('sip') || query.includes('portfolio') || query.includes('return')) {
    return `📊 **Investment & Wealth Building Strategy**:
Smart investing is about putting your saved cash to work to generate compounding interest over time.

• **Rule of 72**: Divide 72 by your expected annual return percentage to find out how many years it takes to double your money (e.g., 72 / 10% = 7.2 years).
• **Asset Allocation**: A benchmark starting point is (100 - Your Age)% in growth equities/index funds, with the remainder in capital-preservation debt instruments.
• **Low-Cost Index Funds**: Choose low expense ratio (<0.20%) index funds or ETFs to maximize long-term gains.
• **Compounding Growth**: Reinvest all dividends and capital gains over 5 to 10+ year horizons for exponential growth.`;
  }

  // Inflation & Economy
  if (query.includes('inflation') || query.includes('economy') || query.includes('interest rate') || query.includes('fed') || query.includes('rbi')) {
    return `🛡️ **Inflation & Economic Defense Strategy**:
Inflation reduces the purchasing power of your money over time.

• **Inflation Impact**: At a 6% inflation rate, everyday living costs double roughly every 12 years.
• **Hedge Against Inflation**: Broad market equities, real estate, and inflation-indexed bonds historically outpace inflation.
• **Cash Drag Warning**: Keeping excess cash beyond your emergency fund in a low-interest bank account means losing real value every year.`;
  }

  // Taxes & Tax Saving
  if (query.includes('tax') || query.includes('deduction') || query.includes('401k') || query.includes('ira') || query.includes('ppf') || query.includes('elss')) {
    return `📝 **Tax Optimization & Wealth Preservation**:
Minimizing your tax liability legally leaves more money in your wallet to invest.

• **Tax-Advantaged Accounts**: Maximize contributions to tax-deferred or tax-free accounts (e.g. 401(k), Roth IRA, PPF, NPS, or ELSS).
• **Long-Term Capital Gains**: Holding investments for over 1 year typically qualifies for significantly lower capital gains tax rates compared to short-term trading.
• **Tax-Loss Harvesting**: Offset capital gains by realizing losses on underperforming assets where applicable.`;
  }

  // Debt & Credit Cards
  if (query.includes('debt') || query.includes('loan') || query.includes('credit') || query.includes('interest') || query.includes('emi') || query.includes('mortgage')) {
    return `💳 **Debt Elimination & Credit Strategy**:
Paying off high-interest debt yields a guaranteed return equal to the interest rate on the loan!

• **Debt Avalanche Method**: Pay minimums on all debts, then direct every extra dollar to the debt with the highest interest rate (e.g., 20%+ credit cards).
• **Debt Snowball Method**: Pay off the smallest balance first for quick psychological momentum.
• **Healthy Credit Score**: Maintain credit utilization under 30% and pay statement balances in full every month.`;
  }

  // Expenses & Reducing Spending
  if (query.includes('reduce') || query.includes('cut') || query.includes('save') || query.includes('spend') || query.includes('cost')) {
    return `💡 **Expense Optimization & Budget Trimming**:
Based on your current financial metrics:

• **Target High-Variance Categories**: Dining out, subscriptions, and impulse shopping are the easiest categories to trim without affecting quality of life.
• **Apply the 50/30/20 Rule**: Allocate 50% of net income to mandatory Needs, 30% to Wants, and at least 20% to Savings/Debt payoff.
• **48-Hour Cooling Rule**: Enforce a mandatory 48-hour waiting period before making non-essential purchases over ${currency}2,000.`;
  }

  // Budgeting & Planning
  if (query.includes('budget') || query.includes('plan') || query.includes('envelope') || query.includes('allocation')) {
    return `🎯 **Strategic Budgeting & Cash Flow Control**:
A structured budget ensures you direct your money intentionally rather than wondering where it went.

• **Housing & Overhead Cap**: Keep rent/mortgage and utilities under 35% of net monthly income.
• **Automated Payday Transfers**: Set up automatic transfers to your savings/investment account the morning your salary arrives.
• **Zero-Based Budgeting**: Assign every incoming dollar a specific job (bills, savings, or spending caps).`;
  }

  // Emergency Fund
  if (query.includes('emergency') || query.includes('fund') || query.includes('safety') || query.includes('cushion')) {
    return `🛡️ **Emergency Fund & Security Cushion**:
An emergency fund protects you from life's unexpected expenses without taking on high-interest debt.

• **Target Cushion**: Strive for 3 to 6 months of essential living expenses (rent, food, utilities, minimum debt).
• **High Liquidity**: Store this fund in a high-yield savings account (HYSA) or liquid mutual fund with instant penalty-free access.
• **Weekly Milestones**: Break the total target into small weekly auto-deposits to build it consistently.`;
  }

  // Crypto / High Risk
  if (query.includes('crypto') || query.includes('bitcoin') || query.includes('ethereum') || query.includes('coin')) {
    return `⚡ **Cryptocurrency & High-Risk Asset Advice**:
Digital assets carry high volatility and speculative risk.

• **Risk Cap**: Keep high-risk speculative investments under 5% of your total net worth.
• **Core Portfolio First**: Ensure your emergency fund and low-cost index investments are established before speculating on volatile assets.`;
  }

  // Default General Advice
  return `🧠 **FinBot AI Personal Finance Advice**:
Here is strategic decision support grounded in standard financial principles:

• **Positive Cash Flow**: Keep total monthly outflows under 80% of net incoming cash flow.
• **20% Savings Rate**: Target investing or saving at least 20% of every paycheck.
• **High-Yield Reserves**: Maintain a 3 to 6-month emergency reserve in a liquid account.

*Ask me specifically about stock market strategies, index funds, budget allocations, debt reduction, or tax optimization!*`;
}

// 1. FinBot AI Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, financialContext, currency = '₹' } = req.body;
    const ai = getGeminiClient();

    const latestUserMsg = Array.isArray(messages) && messages.length > 0
      ? messages[messages.length - 1].content || ''
      : 'Hello FinBot';

    if (!ai) {
      const reply = generateSmartFinancialResponse(latestUserMsg, financialContext, currency);
      return res.json({ reply, fallback: true });
    }

    const systemInstruction = `You are FinBot, an expert, encouraging, and highly analytical AI Personal Finance Advisor.
Your mission is to provide clear, actionable, non-judgmental financial guidance, stock market explanations, budgeting tips, spending optimizations, and savings strategies.
Always ground your answers in the user's provided financial summary (income, expenses, budgets, savings goals, overspending alerts).

User Financial Snapshot:
${financialContext || 'No financial data provided yet.'}
Preferred Currency: ${currency}

Guidelines:
1. Be concise, structured, and practical (use bullet points and bold key numbers).
2. Clearly distinguish mathematical calculations from subjective recommendations.
3. Address the user directly in a supportive, confident tone.`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(messages)) {
      for (const m of messages) {
        contents.push({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        });
      }
    }

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: latestUserMsg }] });
    }

    // Try primary and fallback Gemini models
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-3.8-flash'];
    let reply = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: { systemInstruction, temperature: 0.7 },
        });
        if (response.text) {
          reply = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} call failed, trying next fallback model...`, err?.message || err);
      }
    }

    if (!reply) {
      reply = generateSmartFinancialResponse(latestUserMsg, financialContext, currency);
    }

    res.json({ reply, fallback: false });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    const { messages, financialContext, currency = '₹' } = req.body;
    const latestUserMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content || '' : '';
    const reply = generateSmartFinancialResponse(latestUserMsg, financialContext, currency);
    res.json({
      reply,
      fallback: true,
    });
  }
});

// 2. AI Budget Generator
app.post('/api/ai/generate-budget', async (req, res) => {
  try {
    const { income = 50000, fixedExpenses = 20000, variableExpenses = 15000, financialGoal = 'General Savings', currentSavings = 10000, dependents = 0, currency = '₹' } = req.body;
    const ai = getGeminiClient();

    // Standard rule-based baseline calculation (50/30/20 benchmark)
    const baseEssential = Math.round(income * 0.5);
    const baseFlexible = Math.round(income * 0.3);
    const baseSavings = Math.round(income * 0.2);

    if (!ai) {
      return res.json({
        recommendedBudget: {
          essentialExpenses: baseEssential,
          flexibleExpenses: baseFlexible,
          savings: baseSavings,
          emergencyFund: Math.round(income * 0.1),
        },
        categoryBreakdown: [
          { category: 'Housing & Rent', amount: Math.round(income * 0.28), percentage: 28 },
          { category: 'Food & Groceries', amount: Math.round(income * 0.15), percentage: 15 },
          { category: 'Utilities & Bills', amount: Math.round(income * 0.07), percentage: 7 },
          { category: 'Transport', amount: Math.round(income * 0.10), percentage: 10 },
          { category: 'Shopping & Leisure', amount: Math.round(income * 0.12), percentage: 12 },
          { category: 'Healthcare', amount: Math.round(income * 0.05), percentage: 5 },
          { category: 'Emergency Savings', amount: Math.round(income * 0.10), percentage: 10 },
          { category: 'Investments / Goals', amount: Math.round(income * 0.13), percentage: 13 },
        ],
        reasoning: `Based on your monthly income of ${currency}${income.toLocaleString()}, the classic 50/30/20 balanced model was applied. Allocating ${currency}${baseEssential.toLocaleString()} for essentials, ${currency}${baseFlexible.toLocaleString()} for flexible lifestyle spending, and ${currency}${baseSavings.toLocaleString()} toward ${financialGoal} provides sustainable growth and risk protection.`,
        keyRecommendations: [
          `Cap fixed housing and utility commitments under 35% of total income.`,
          `Automate an immediate transfer of ${currency}${baseSavings.toLocaleString()} on payday.`,
          `Maintain an emergency liquid buffer equivalent to 3 to 6 months of basic living costs.`,
        ],
        fallback: true,
      });
    }

    const prompt = `Act as an expert financial planner.
Generate an optimal monthly budget based on the following user profile:
- Monthly Net Income: ${currency}${income}
- Stated Fixed Expenses: ${currency}${fixedExpenses}
- Stated Variable Expenses: ${currency}${variableExpenses}
- Target Financial Goal: ${financialGoal}
- Current Accumulated Savings: ${currency}${currentSavings}
- Number of Dependents: ${dependents}
- Currency: ${currency}

Provide a realistic, mathematically sound budget allocation following modern budgeting frameworks tailored to this profile.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedBudget: {
              type: Type.OBJECT,
              properties: {
                essentialExpenses: { type: Type.NUMBER, description: 'Mandatory needs amount' },
                flexibleExpenses: { type: Type.NUMBER, description: 'Discretionary wants amount' },
                savings: { type: Type.NUMBER, description: 'Savings and investments' },
                emergencyFund: { type: Type.NUMBER, description: 'Recommended emergency fund allocation' },
              },
              required: ['essentialExpenses', 'flexibleExpenses', 'savings', 'emergencyFund'],
            },
            categoryBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  percentage: { type: Type.NUMBER },
                },
                required: ['category', 'amount', 'percentage'],
              },
            },
            reasoning: { type: Type.STRING, description: 'Analytical explanation of this budget' },
            keyRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['recommendedBudget', 'categoryBreakdown', 'reasoning', 'keyRecommendations'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ...parsed, fallback: false });
  } catch (error: any) {
    console.error('Error generating budget:', error);
    const { income = 50000, financialGoal = 'General Savings', currency = '₹' } = req.body;
    const baseEssential = Math.round(income * 0.5);
    const baseFlexible = Math.round(income * 0.3);
    const baseSavings = Math.round(income * 0.2);

    res.json({
      recommendedBudget: {
        essentialExpenses: baseEssential,
        flexibleExpenses: baseFlexible,
        savings: baseSavings,
        emergencyFund: Math.round(income * 0.1),
      },
      categoryBreakdown: [
        { category: 'Housing & Rent', amount: Math.round(income * 0.28), percentage: 28 },
        { category: 'Food & Groceries', amount: Math.round(income * 0.15), percentage: 15 },
        { category: 'Utilities & Bills', amount: Math.round(income * 0.07), percentage: 7 },
        { category: 'Transport', amount: Math.round(income * 0.10), percentage: 10 },
        { category: 'Shopping & Leisure', amount: Math.round(income * 0.12), percentage: 12 },
        { category: 'Healthcare', amount: Math.round(income * 0.05), percentage: 5 },
        { category: 'Emergency Savings', amount: Math.round(income * 0.10), percentage: 10 },
        { category: 'Investments / Goals', amount: Math.round(income * 0.13), percentage: 13 },
      ],
      reasoning: `Based on your monthly income of ${currency}${income.toLocaleString()}, standard 50/30/20 allocation was applied: ${currency}${baseEssential.toLocaleString()} for essentials, ${currency}${baseFlexible.toLocaleString()} for lifestyle desires, and ${currency}${baseSavings.toLocaleString()} toward ${financialGoal}.`,
      keyRecommendations: [
        `Automate an immediate transfer of ${currency}${baseSavings.toLocaleString()} on payday.`,
        `Cap variable dining and shopping to prevent mid-month deficits.`,
        `Maintain an emergency buffer covering at least 3 months of basic living expenses.`,
      ],
      fallback: true,
    });
  }
});

// 3. AI Spending Analysis
app.post('/api/ai/analyze-spending', async (req, res) => {
  try {
    const { categorySpending, totalIncome, totalExpenses, currency = '₹' } = req.body;
    const ai = getGeminiClient();

    const spendingEntries = Object.entries(categorySpending || {});
    spendingEntries.sort((a: any, b: any) => b[1] - a[1]);
    const topCategory = spendingEntries.length > 0 ? spendingEntries[0] : ['General', 0];

    if (!ai) {
      return res.json({
        summary: `You have spent ${currency}${Number(totalExpenses).toLocaleString()} out of ${currency}${Number(totalIncome).toLocaleString()} this month (${Math.round((totalExpenses / (totalIncome || 1)) * 100)}% burn rate).`,
        highSpendingCategories: spendingEntries.slice(0, 3).map(([cat, amt]) => ({
          category: cat,
          amount: amt,
          insight: `${cat} represents ${Math.round((Number(amt) / (totalExpenses || 1)) * 100)}% of total monthly spending.`,
        })),
        potentialLeakages: [
          `Frequent discretionary expenses in ${topCategory[0]} can be trimmed by 10-15%.`,
          `Consolidate automated online service subscriptions.`,
        ],
        savingsOpportunities: [
          `Redirecting 10% from ${topCategory[0]} would yield an extra ${currency}${Math.round(Number(topCategory[1]) * 0.1).toLocaleString()} in monthly savings.`,
          `Set up weekly sub-budgets to prevent end-of-month cash pinches.`,
        ],
        actionPlan: [
          'Audit all food and shopping transactions over the past 30 days.',
          'Review recurring monthly bills for lower tier alternatives.',
          'Enforce a 48-hour cool-off rule before non-essential purchases.',
        ],
        fallback: true,
      });
    }

    const prompt = `Analyze this personal finance spending breakdown:
Total Income: ${currency}${totalIncome}
Total Expenses: ${currency}${totalExpenses}
Category Breakdown:
${spendingEntries.map(([c, a]) => `- ${c}: ${currency}${a}`).join('\n')}

Identify high spending categories, spending leakage, realistic savings opportunities, and concrete action steps. Return JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            highSpendingCategories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  insight: { type: Type.STRING },
                },
                required: ['category', 'amount', 'insight'],
              },
            },
            potentialLeakages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            savingsOpportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'highSpendingCategories', 'potentialLeakages', 'savingsOpportunities', 'actionPlan'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ...parsed, fallback: false });
  } catch (error: any) {
    console.error('Error analyzing spending:', error);
    const { categorySpending, totalIncome = 75000, totalExpenses = 40000, currency = '₹' } = req.body;
    const spendingEntries = Object.entries(categorySpending || {});
    spendingEntries.sort((a: any, b: any) => b[1] - a[1]);
    const topCategory = spendingEntries.length > 0 ? spendingEntries[0] : ['General', 0];

    res.json({
      summary: `You have spent ${currency}${Number(totalExpenses).toLocaleString()} out of ${currency}${Number(totalIncome).toLocaleString()} this month (${Math.round((totalExpenses / (totalIncome || 1)) * 100)}% burn rate).`,
      highSpendingCategories: spendingEntries.slice(0, 3).map(([cat, amt]) => ({
        category: cat,
        amount: amt,
        insight: `${cat} represents ${Math.round((Number(amt) / (totalExpenses || 1)) * 100)}% of total monthly spending.`,
      })),
      potentialLeakages: [
        `Frequent discretionary expenses in ${topCategory[0]} can be trimmed by 10-15%.`,
        `Consolidate automated online service subscriptions.`,
      ],
      savingsOpportunities: [
        `Redirecting 10% from ${topCategory[0]} yields an extra ${currency}${Math.round(Number(topCategory[1]) * 0.1).toLocaleString()} in monthly savings.`,
        `Establish weekly envelopes to avoid month-end deficits.`,
      ],
      actionPlan: [
        'Audit all food and shopping transactions over the past 30 days.',
        'Review recurring monthly bills for lower tier alternatives.',
        'Enforce a 48-hour cool-off rule before non-essential purchases.',
      ],
      fallback: true,
    });
  }
});

// 4. AI Savings Planner
app.post('/api/ai/savings-plan', async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, targetMonths, monthlyIncome, monthlyExpenses, currency = '₹' } = req.body;
    const ai = getGeminiClient();

    const remaining = Math.max(0, targetAmount - currentAmount);
    const months = Math.max(1, targetMonths || 6);
    const calculatedMonthlyTarget = Math.round(remaining / months);
    const calculatedWeeklyTarget = Math.round(calculatedMonthlyTarget / 4.33);
    const monthlyNetFlow = monthlyIncome - monthlyExpenses;
    const isFeasible = monthlyNetFlow >= calculatedMonthlyTarget;

    if (!ai) {
      return res.json({
        monthlySavingsTarget: calculatedMonthlyTarget,
        weeklySavingsTarget: calculatedWeeklyTarget,
        goalTimelineMonths: months,
        feasibilityStatus: isFeasible ? 'Realistic & Achievable' : 'Stretched - Requires Cost Adjustments',
        emergencyFundGuidance: `Maintain at least ${currency}${(monthlyExpenses * 3).toLocaleString()} in liquid reserves alongside this goal.`,
        suggestedExpenseAdjustments: [
          `Cap dining and entertainment to free up approximately ${currency}${Math.round(calculatedMonthlyTarget * 0.3).toLocaleString()}/month.`,
          `Automate scheduled transfers of ${currency}${calculatedWeeklyTarget.toLocaleString()} every Monday.`,
        ],
        milestones: [
          { percentage: 25, amount: Math.round(targetAmount * 0.25), timelineText: `Month ${Math.max(1, Math.round(months * 0.25))}` },
          { percentage: 50, amount: Math.round(targetAmount * 0.50), timelineText: `Month ${Math.max(1, Math.round(months * 0.50))}` },
          { percentage: 75, amount: Math.round(targetAmount * 0.75), timelineText: `Month ${Math.max(1, Math.round(months * 0.75))}` },
          { percentage: 100, amount: targetAmount, timelineText: `Month ${months}` },
        ],
        fallback: true,
      });
    }

    const prompt = `Create an intelligent savings plan:
Goal Name: ${goalName}
Target Amount: ${currency}${targetAmount}
Currently Saved: ${currency}${currentAmount}
Desired Timeline: ${months} months
User Net Monthly Income: ${currency}${monthlyIncome}
User Monthly Expenses: ${currency}${monthlyExpenses}
Monthly Surplus: ${currency}${monthlyNetFlow}

Analyze feasibility, calculate weekly & monthly targets, suggest expense adjustments, and formulate milestones.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            monthlySavingsTarget: { type: Type.NUMBER },
            weeklySavingsTarget: { type: Type.NUMBER },
            goalTimelineMonths: { type: Type.NUMBER },
            feasibilityStatus: { type: Type.STRING },
            emergencyFundGuidance: { type: Type.STRING },
            suggestedExpenseAdjustments: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  percentage: { type: Type.NUMBER },
                  amount: { type: Type.NUMBER },
                  timelineText: { type: Type.STRING },
                },
                required: ['percentage', 'amount', 'timelineText'],
              },
            },
          },
          required: ['monthlySavingsTarget', 'weeklySavingsTarget', 'goalTimelineMonths', 'feasibilityStatus', 'emergencyFundGuidance', 'suggestedExpenseAdjustments', 'milestones'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ...parsed, fallback: false });
  } catch (error: any) {
    console.error('Error generating savings plan:', error);
    const { goalName = 'Emergency Cushion', targetAmount = 100000, currentAmount = 20000, targetMonths = 6, monthlyIncome = 75000, monthlyExpenses = 40000, currency = '₹' } = req.body;
    const remaining = Math.max(0, targetAmount - currentAmount);
    const months = Math.max(1, targetMonths || 6);
    const calculatedMonthlyTarget = Math.round(remaining / months);
    const calculatedWeeklyTarget = Math.round(calculatedMonthlyTarget / 4.33);
    const monthlyNetFlow = monthlyIncome - monthlyExpenses;
    const isFeasible = monthlyNetFlow >= calculatedMonthlyTarget;

    res.json({
      monthlySavingsTarget: calculatedMonthlyTarget,
      weeklySavingsTarget: calculatedWeeklyTarget,
      goalTimelineMonths: months,
      feasibilityStatus: isFeasible ? 'Realistic & Achievable' : 'Stretched - Requires Cost Adjustments',
      emergencyFundGuidance: `Maintain at least ${currency}${(monthlyExpenses * 3).toLocaleString()} in liquid reserves alongside this goal.`,
      suggestedExpenseAdjustments: [
        `Cap dining and entertainment to free up approximately ${currency}${Math.round(calculatedMonthlyTarget * 0.3).toLocaleString()}/month.`,
        `Automate scheduled transfers of ${currency}${calculatedWeeklyTarget.toLocaleString()} every Monday.`,
      ],
      milestones: [
        { percentage: 25, amount: Math.round(targetAmount * 0.25), timelineText: `Month ${Math.max(1, Math.round(months * 0.25))}` },
        { percentage: 50, amount: Math.round(targetAmount * 0.50), timelineText: `Month ${Math.max(1, Math.round(months * 0.50))}` },
        { percentage: 75, amount: Math.round(targetAmount * 0.75), timelineText: `Month ${Math.max(1, Math.round(months * 0.75))}` },
        { percentage: 100, amount: targetAmount, timelineText: `Month ${months}` },
      ],
      fallback: true,
    });
  }
});

// 5. FinBot Text-to-Speech (Live Voice Experience)
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ audioBase64: null, useBrowserFallback: true });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 300), // optimal speech chunk
              speechMetadata: {
                style: 'Warm, professional, financial advisor',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio, mimeType: 'audio/wav', useBrowserFallback: false });
    }

    res.json({ audioBase64: null, useBrowserFallback: true });
  } catch (error: any) {
    console.error('Error in TTS:', error);
    res.json({ audioBase64: null, useBrowserFallback: true });
  }
});

// Setup Vite middleware in dev or static serve in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Finance Advisor Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
