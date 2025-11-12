#!/usr/bin/env tsx
/**
 * Cost Monitoring Script
 *
 * Tracks API usage and estimates costs for:
 * - Google Gemini API (image processing)
 * - Replicate API (NSFW processing)
 * - OpenAI API (DALL-E canvas generation)
 * - Vercel bandwidth and function invocations
 * - InstantDB usage
 * - Resend email sends
 *
 * Usage: npm run monitor:costs
 */

import { kv } from '@vercel/kv';
import * as fs from 'fs';
import * as path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Cost per unit (in USD)
const COSTS = {
  gemini: {
    inputTokens: 0.00015 / 1000, // $0.00015 per 1K input tokens
    outputTokens: 0.0006 / 1000, // $0.0006 per 1K output tokens
    imageInputs: 0.00025 // ~$0.00025 per image (estimate)
  },
  replicate: {
    perImage: 0.023 // $0.023 per SDXL img2img generation
  },
  openai: {
    dalle3_1024: 0.040, // $0.04 per 1024x1024 image
    dalle3_1792: 0.080  // $0.08 per 1792x1024 or 1024x1792 image
  },
  vercel: {
    functionInvocation: 0.00000040, // $0.40 per 1M invocations
    functionGBSeconds: 0.000018, // $0.000018 per GB-second
    bandwidth: 0.15 // $0.15 per GB (after 100GB free)
  },
  resend: {
    perEmail: 0.0001 // $0.10 per 1000 emails (after 3000 free)
  },
  instantdb: {
    free: 0 // Free tier: 5GB storage, 1M reads, 100K writes
  }
};

// Daily thresholds for alerts
const THRESHOLDS = {
  dailyTotal: 100, // Alert if daily cost exceeds $100
  geminiDaily: 50,
  replicateDaily: 50,
  openaiDaily: 30,
  vercelDaily: 20,
  resendDaily: 5
};

interface UsageMetrics {
  gemini: {
    imageProcessingCount: number;
    estimatedCost: number;
  };
  replicate: {
    nsfwProcessingCount: number;
    estimatedCost: number;
  };
  openai: {
    canvasGenerationCount: number;
    estimatedCost: number;
  };
  vercel: {
    functionInvocations: number;
    estimatedCost: number;
  };
  resend: {
    emailsSent: number;
    estimatedCost: number;
  };
  totalEstimatedCost: number;
}

async function getUsageMetrics(): Promise<UsageMetrics> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Fetch from Vercel KV (assuming we track usage there)
  const geminiCount = await kv.get<number>(`usage:gemini:${today}`) || 0;
  const replicateCount = await kv.get<number>(`usage:replicate:${today}`) || 0;
  const openaiCount = await kv.get<number>(`usage:openai:${today}`) || 0;
  const functionInvocations = await kv.get<number>(`usage:functions:${today}`) || 0;
  const emailsSent = await kv.get<number>(`usage:emails:${today}`) || 0;

  // Calculate costs
  const geminiCost = geminiCount * COSTS.gemini.imageInputs;
  const replicateCost = replicateCount * COSTS.replicate.perImage;
  const openaiCost = openaiCount * COSTS.openai.dalle3_1024; // Assume 1024x1024
  const vercelCost = functionInvocations * COSTS.vercel.functionInvocation;
  const resendCost = Math.max(0, (emailsSent - 3000)) * COSTS.resend.perEmail; // First 3000 free

  const totalCost = geminiCost + replicateCost + openaiCost + vercelCost + resendCost;

  return {
    gemini: {
      imageProcessingCount: geminiCount,
      estimatedCost: geminiCost
    },
    replicate: {
      nsfwProcessingCount: replicateCount,
      estimatedCost: replicateCost
    },
    openai: {
      canvasGenerationCount: openaiCount,
      estimatedCost: openaiCost
    },
    vercel: {
      functionInvocations,
      estimatedCost: vercelCost
    },
    resend: {
      emailsSent,
      estimatedCost: resendCost
    },
    totalEstimatedCost: totalCost
  };
}

async function trackUsage(service: string, count: number) {
  const today = new Date().toISOString().split('T')[0];
  const key = `usage:${service}:${today}`;

  const currentCount = await kv.get<number>(key) || 0;
  await kv.set(key, currentCount + count, { ex: 7 * 24 * 60 * 60 }); // 7 day expiry
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function getMonthlyEstimate(dailyCost: number): number {
  return dailyCost * 30;
}

async function printDashboard() {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║            PicForge Cost Monitoring Dashboard            ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  const metrics = await getUsageMetrics();

  console.log(`\n${colors.bold}Today's Usage (${new Date().toISOString().split('T')[0]})${colors.reset}\n`);

  // Gemini API
  console.log(`${colors.blue}Google Gemini API:${colors.reset}`);
  console.log(`  Image Transformations: ${metrics.gemini.imageProcessingCount.toLocaleString()}`);
  console.log(`  Estimated Cost: ${formatCurrency(metrics.gemini.estimatedCost)}`);
  console.log(`  Status: ${metrics.gemini.estimatedCost > THRESHOLDS.geminiDaily ? colors.red + '⚠ High' : colors.green + '✓ Normal'}${colors.reset}\n`);

  // Replicate API
  console.log(`${colors.magenta}Replicate API (NSFW):${colors.reset}`);
  console.log(`  NSFW Transformations: ${metrics.replicate.nsfwProcessingCount.toLocaleString()}`);
  console.log(`  Estimated Cost: ${formatCurrency(metrics.replicate.estimatedCost)}`);
  console.log(`  Status: ${metrics.replicate.estimatedCost > THRESHOLDS.replicateDaily ? colors.red + '⚠ High' : colors.green + '✓ Normal'}${colors.reset}\n`);

  // OpenAI API
  console.log(`${colors.green}OpenAI API (DALL-E):${colors.reset}`);
  console.log(`  Canvas Generations: ${metrics.openai.canvasGenerationCount.toLocaleString()}`);
  console.log(`  Estimated Cost: ${formatCurrency(metrics.openai.estimatedCost)}`);
  console.log(`  Status: ${metrics.openai.estimatedCost > THRESHOLDS.openaiDaily ? colors.red + '⚠ High' : colors.green + '✓ Normal'}${colors.reset}\n`);

  // Vercel
  console.log(`${colors.cyan}Vercel (Functions):${colors.reset}`);
  console.log(`  Function Invocations: ${metrics.vercel.functionInvocations.toLocaleString()}`);
  console.log(`  Estimated Cost: ${formatCurrency(metrics.vercel.estimatedCost)}`);
  console.log(`  Status: ${metrics.vercel.estimatedCost > THRESHOLDS.vercelDaily ? colors.red + '⚠ High' : colors.green + '✓ Normal'}${colors.reset}\n`);

  // Resend
  console.log(`${colors.yellow}Resend (Emails):${colors.reset}`);
  console.log(`  Emails Sent: ${metrics.resend.emailsSent.toLocaleString()}`);
  console.log(`  Estimated Cost: ${formatCurrency(metrics.resend.estimatedCost)}`);
  console.log(`  Status: ${metrics.resend.estimatedCost > THRESHOLDS.resendDaily ? colors.red + '⚠ High' : colors.green + '✓ Normal'}${colors.reset}\n`);

  // Total
  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}TOTAL DAILY COST: ${formatCurrency(metrics.totalEstimatedCost)}${colors.reset}`);
  console.log(`${colors.bold}Projected Monthly: ${formatCurrency(getMonthlyEstimate(metrics.totalEstimatedCost))}${colors.reset}`);
  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Alerts
  if (metrics.totalEstimatedCost > THRESHOLDS.dailyTotal) {
    console.log(`${colors.red}${colors.bold}⚠ ALERT: Daily cost exceeds threshold of ${formatCurrency(THRESHOLDS.dailyTotal)}!${colors.reset}`);
    console.log(`${colors.yellow}Consider reviewing usage patterns and optimizing API calls.${colors.reset}\n`);
  }

  // Cost Breakdown Chart (ASCII)
  console.log(`${colors.bold}Cost Breakdown:${colors.reset}\n`);

  const percentages = {
    gemini: (metrics.gemini.estimatedCost / metrics.totalEstimatedCost) * 100 || 0,
    replicate: (metrics.replicate.estimatedCost / metrics.totalEstimatedCost) * 100 || 0,
    openai: (metrics.openai.estimatedCost / metrics.totalEstimatedCost) * 100 || 0,
    vercel: (metrics.vercel.estimatedCost / metrics.totalEstimatedCost) * 100 || 0,
    resend: (metrics.resend.estimatedCost / metrics.totalEstimatedCost) * 100 || 0
  };

  const barWidth = 50;
  Object.entries(percentages).forEach(([service, percent]) => {
    const bar = '█'.repeat(Math.round((percent / 100) * barWidth));
    const label = service.padEnd(10);
    console.log(`  ${label} ${bar} ${percent.toFixed(1)}%`);
  });

  console.log('\n');

  // Recommendations
  console.log(`${colors.bold}Optimization Recommendations:${colors.reset}\n`);

  if (metrics.gemini.estimatedCost > metrics.totalEstimatedCost * 0.6) {
    console.log(`${colors.yellow}→ Gemini API is 60%+ of costs. Consider:${colors.reset}`);
    console.log('  - Implementing image caching for repeated prompts');
    console.log('  - Reducing image resolution before processing');
    console.log('  - Rate limiting aggressive users\n');
  }

  if (metrics.replicate.nsfwProcessingCount > 100) {
    console.log(`${colors.yellow}→ High NSFW API usage. Consider:${colors.reset}`);
    console.log('  - Warning users about per-image costs');
    console.log('  - Setting daily limits for NSFW processing');
    console.log('  - Caching NSFW results\n');
  }

  if (metrics.openai.canvasGenerationCount > 50) {
    console.log(`${colors.yellow}→ High DALL-E usage. Consider:${colors.reset}`);
    console.log('  - Defaulting to free alternatives (Pollinations, HuggingFace)');
    console.log('  - Restricting DALL-E to Pro users only\n');
  }

  // Save report
  const reportPath = path.join(process.cwd(), 'cost-report.json');
  const report = {
    date: new Date().toISOString(),
    metrics,
    projectedMonthly: getMonthlyEstimate(metrics.totalEstimatedCost)
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`${colors.cyan}Report saved to: cost-report.json${colors.reset}\n`);
}

async function get7DayHistory() {
  console.log(`\n${colors.bold}7-Day Cost History:${colors.reset}\n`);

  const days: { date: string; cost: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const geminiCount = await kv.get<number>(`usage:gemini:${dateStr}`) || 0;
    const replicateCount = await kv.get<number>(`usage:replicate:${dateStr}`) || 0;
    const openaiCount = await kv.get<number>(`usage:openai:${dateStr}`) || 0;

    const dailyCost =
      (geminiCount * COSTS.gemini.imageInputs) +
      (replicateCount * COSTS.replicate.perImage) +
      (openaiCount * COSTS.openai.dalle3_1024);

    days.push({ date: dateStr, cost: dailyCost });
  }

  // ASCII chart
  const maxCost = Math.max(...days.map(d => d.cost), 1);
  const chartHeight = 10;

  days.forEach(({ date, cost }) => {
    const barHeight = Math.round((cost / maxCost) * chartHeight);
    const bar = '▓'.repeat(barHeight);
    console.log(`  ${date}  ${bar} ${formatCurrency(cost)}`);
  });

  const avgCost = days.reduce((sum, d) => sum + d.cost, 0) / days.length;
  console.log(`\n  ${colors.cyan}7-day average: ${formatCurrency(avgCost)}/day${colors.reset}`);
  console.log(`  ${colors.cyan}Projected monthly: ${formatCurrency(avgCost * 30)}${colors.reset}\n`);
}

async function exportCSV() {
  console.log(`\n${colors.bold}Exporting cost history to CSV...${colors.reset}`);

  const rows: string[] = ['Date,Gemini,Replicate,OpenAI,Vercel,Resend,Total'];

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const geminiCount = await kv.get<number>(`usage:gemini:${dateStr}`) || 0;
    const replicateCount = await kv.get<number>(`usage:replicate:${dateStr}`) || 0;
    const openaiCount = await kv.get<number>(`usage:openai:${dateStr}`) || 0;
    const functionInvocations = await kv.get<number>(`usage:functions:${dateStr}`) || 0;
    const emailsSent = await kv.get<number>(`usage:emails:${dateStr}`) || 0;

    const geminiCost = geminiCount * COSTS.gemini.imageInputs;
    const replicateCost = replicateCount * COSTS.replicate.perImage;
    const openaiCost = openaiCount * COSTS.openai.dalle3_1024;
    const vercelCost = functionInvocations * COSTS.vercel.functionInvocation;
    const resendCost = Math.max(0, (emailsSent - 3000)) * COSTS.resend.perEmail;
    const totalCost = geminiCost + replicateCost + openaiCost + vercelCost + resendCost;

    rows.push(`${dateStr},${geminiCost.toFixed(2)},${replicateCost.toFixed(2)},${openaiCost.toFixed(2)},${vercelCost.toFixed(2)},${resendCost.toFixed(2)},${totalCost.toFixed(2)}`);
  }

  const csvPath = path.join(process.cwd(), 'cost-history.csv');
  fs.writeFileSync(csvPath, rows.join('\n'));

  console.log(`${colors.green}✓ Exported 30 days of cost history to: cost-history.csv${colors.reset}\n`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--export')) {
    await exportCSV();
    return;
  }

  await printDashboard();
  await get7DayHistory();

  console.log(`${colors.cyan}💡 Tip: Run with --export to export 30 days of cost history to CSV${colors.reset}\n`);
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
