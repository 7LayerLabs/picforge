#!/usr/bin/env tsx
/**
 * Email Testing Script
 *
 * Tests all email templates using Resend API:
 * 1. Welcome email (on signup)
 * 2. Rate limit warning (at 15 images)
 * 3. Daily limit reached (at 20 images)
 * 4. Pro upgrade confirmation
 *
 * Usage: npm run test:emails
 */

import { Resend } from 'resend';

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

interface TestResult {
  template: string;
  passed: boolean;
  message: string;
  emailId?: string;
  error?: string;
}

const results: TestResult[] = [];

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Test email address (change to your email)
const TEST_EMAIL = 'derek.bobola@gmail.com';

async function sendWelcomeEmail() {
  console.log(`\n${colors.blue}Test 1: Welcome Email${colors.reset}`);
  console.log('Sending welcome email to new user...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'PicForge <noreply@picforge.com>',
      to: [TEST_EMAIL],
      subject: 'Welcome to PicForge - Start Transforming Your Images!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .tagline {
              color: #14b8a6;
              font-style: italic;
            }
            .content {
              background: white;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
            }
            .cta-button {
              display: inline-block;
              background: #14b8a6;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .badge {
              display: inline-block;
              background: #f3f4f6;
              padding: 8px 16px;
              border-radius: 20px;
              margin: 5px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">PicForge</div>
            <div class="tagline">(re)Imagine. Everything.</div>
          </div>

          <div class="content">
            <h1>Welcome to PicForge! 🎉</h1>

            <p>Hey there,</p>

            <p>Thanks for signing up! You're about to experience AI-powered image transformation like never before.</p>

            <h2>What You Get (Free Tier):</h2>
            <div>
              <span class="badge">✨ 20 AI transformations per day</span>
              <span class="badge">🎨 272+ creative prompts</span>
              <span class="badge">🎡 Transform Roulette game</span>
              <span class="badge">🔥 Roast Mode</span>
              <span class="badge">🎯 Batch processing</span>
            </div>

            <p style="margin-top: 20px;">Ready to transform your first image?</p>

            <center>
              <a href="https://picforge.com/editor" class="cta-button">Start Creating →</a>
            </center>

            <h3>Quick Tips:</h3>
            <ul>
              <li><strong>Try Template Prompts:</strong> Browse 272+ pre-made prompts across 13 categories</li>
              <li><strong>Lock Composition:</strong> Check "Lock Composition" to keep your image structure while applying styles</li>
              <li><strong>Spin the Wheel:</strong> Try Transform Roulette for random creative surprises</li>
              <li><strong>Go Pro:</strong> Upgrade for unlimited transformations and no watermarks</li>
            </ul>

            <p>Need help? Just reply to this email or visit our <a href="https://picforge.com/tips">Tips & Tricks</a> page.</p>

            <p>Happy transforming!<br>
            The PicForge Team</p>
          </div>

          <div class="footer">
            <p>
              PicForge - AI-Powered Image Transformation<br>
              <a href="https://picforge.com">picforge.com</a> |
              <a href="https://picforge.com/profile">Manage Preferences</a>
            </p>
            <p style="font-size: 12px; color: #9ca3af;">
              You're receiving this because you signed up for PicForge.
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      results.push({
        template: 'Welcome Email',
        passed: false,
        message: 'Failed to send',
        error: error.message
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${error.message}`);
    } else {
      results.push({
        template: 'Welcome Email',
        passed: true,
        message: 'Sent successfully',
        emailId: data?.id
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Welcome email sent`);
      console.log(`  Email ID: ${data?.id}`);
      console.log(`  Check inbox: ${TEST_EMAIL}`);
    }
  } catch (error) {
    results.push({
      template: 'Welcome Email',
      passed: false,
      message: 'Exception occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function sendRateLimitWarning() {
  console.log(`\n${colors.blue}Test 2: Rate Limit Warning Email${colors.reset}`);
  console.log('Sending rate limit warning (15/20 images)...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'PicForge <noreply@picforge.com>',
      to: [TEST_EMAIL],
      subject: 'You\'re Running Low on Daily Transforms (5 Remaining)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
            .content { padding: 20px; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .progress-bar { width: 100%; height: 20px; background: #e5e7eb; border-radius: 10px; overflow: hidden; }
            .progress-fill { height: 100%; background: #f59e0b; width: 75%; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #92400e;">⚠️ Heads Up!</h2>
          </div>

          <div class="content">
            <p>Hi there,</p>

            <p>You've used <strong>15 out of 20</strong> free AI transformations today. Just a friendly heads up that you have <strong>5 transformations remaining</strong>.</p>

            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <p style="text-align: center; color: #6b7280; font-size: 14px;">75% of daily limit used</p>

            <h3>Your Daily Limit Resets In:</h3>
            <p style="font-size: 24px; color: #14b8a6; font-weight: bold;">~9 hours</p>

            <h3>Want Unlimited Transformations?</h3>
            <p>Upgrade to Pro and never worry about limits again:</p>
            <ul>
              <li>✨ <strong>Unlimited AI transformations</strong></li>
              <li>🚫 <strong>No watermarks</strong></li>
              <li>⚡ <strong>Priority processing</strong></li>
              <li>💰 <strong>Only $9.99/month</strong></li>
            </ul>

            <center>
              <a href="https://picforge.com/checkout" class="cta-button">Upgrade to Pro →</a>
            </center>

            <p style="color: #6b7280; font-size: 14px;">No worries if you want to stick with free - your limit resets every 24 hours!</p>

            <p>Happy creating!<br>
            The PicForge Team</p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      results.push({
        template: 'Rate Limit Warning',
        passed: false,
        message: 'Failed to send',
        error: error.message
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${error.message}`);
    } else {
      results.push({
        template: 'Rate Limit Warning',
        passed: true,
        message: 'Sent successfully',
        emailId: data?.id
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Rate limit warning sent`);
      console.log(`  Email ID: ${data?.id}`);
    }
  } catch (error) {
    results.push({
      template: 'Rate Limit Warning',
      passed: false,
      message: 'Exception occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function sendDailyLimitReached() {
  console.log(`\n${colors.blue}Test 3: Daily Limit Reached Email${colors.reset}`);
  console.log('Sending daily limit reached notification...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'PicForge <noreply@picforge.com>',
      to: [TEST_EMAIL],
      subject: 'Daily Transformation Limit Reached - Upgrade to Continue',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; }
            .content { padding: 20px; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-size: 16px; font-weight: bold; }
            .comparison { display: flex; justify-content: space-between; margin: 20px 0; }
            .plan { flex: 1; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; margin: 0 10px; }
            .plan.pro { border-color: #14b8a6; background: #f0fdfa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #991b1b;">🛑 Daily Limit Reached</h2>
          </div>

          <div class="content">
            <p>Hi there,</p>

            <p>You've reached your daily limit of <strong>20 free AI transformations</strong>.</p>

            <h3>Your Limit Resets In:</h3>
            <p style="font-size: 28px; color: #ef4444; font-weight: bold;">~6 hours</p>

            <p><strong>OR</strong> upgrade now and keep creating without limits!</p>

            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; border: 2px solid #14b8a6; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #14b8a6;">🚀 Pro Plan - $9.99/month</h3>
              <ul style="list-style: none; padding: 0;">
                <li>✅ <strong>Unlimited AI transformations</strong></li>
                <li>✅ <strong>No watermarks on images</strong></li>
                <li>✅ <strong>Priority processing queue</strong></li>
                <li>✅ <strong>Early access to new features</strong></li>
                <li>✅ <strong>Cancel anytime</strong></li>
              </ul>

              <center>
                <a href="https://picforge.com/checkout" class="cta-button">Upgrade to Pro Now →</a>
              </center>
            </div>

            <h3>What Happens Next?</h3>
            <p><strong>Free Plan:</strong> Your 20 daily transformations reset every 24 hours. Come back tomorrow to continue!</p>
            <p><strong>Pro Plan:</strong> Transform as many images as you want, whenever you want. No waiting, no limits.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="font-size: 14px; color: #6b7280;">
              <strong>Have a promo code?</strong> Redeem it in your <a href="https://picforge.com/profile">profile settings</a> for instant unlimited access.
            </p>

            <p>Questions? Just reply to this email - we're here to help!</p>

            <p>The PicForge Team</p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      results.push({
        template: 'Daily Limit Reached',
        passed: false,
        message: 'Failed to send',
        error: error.message
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${error.message}`);
    } else {
      results.push({
        template: 'Daily Limit Reached',
        passed: true,
        message: 'Sent successfully',
        emailId: data?.id
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Daily limit email sent`);
      console.log(`  Email ID: ${data?.id}`);
    }
  } catch (error) {
    results.push({
      template: 'Daily Limit Reached',
      passed: false,
      message: 'Exception occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function sendProUpgradeConfirmation() {
  console.log(`\n${colors.blue}Test 4: Pro Upgrade Confirmation Email${colors.reset}`);
  console.log('Sending Pro upgrade confirmation...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'PicForge <noreply@picforge.com>',
      to: [TEST_EMAIL],
      subject: '🎉 Welcome to PicForge Pro!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); color: white; padding: 40px; text-align: center; border-radius: 8px; }
            .content { padding: 30px; background: white; border: 1px solid #e5e7eb; }
            .feature { background: #f0fdfa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #14b8a6; }
            .cta-button { display: inline-block; background: #14b8a6; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 36px;">🎉</h1>
            <h2 style="margin: 10px 0;">Welcome to Pro!</h2>
            <p style="margin: 0; opacity: 0.9;">You're now unlocked for unlimited creativity</p>
          </div>

          <div class="content">
            <p>Hey there,</p>

            <p><strong>Congratulations!</strong> Your upgrade to PicForge Pro is complete. You now have access to:</p>

            <div class="feature">
              <h4 style="margin: 0 0 10px 0; color: #0d9488;">✨ Unlimited AI Transformations</h4>
              <p style="margin: 0; color: #6b7280;">Generate as many images as you want, whenever you want. No more daily limits!</p>
            </div>

            <div class="feature">
              <h4 style="margin: 0 0 10px 0; color: #0d9488;">🚫 No Watermarks</h4>
              <p style="margin: 0; color: #6b7280;">All your transformed images are completely watermark-free and ready to use.</p>
            </div>

            <div class="feature">
              <h4 style="margin: 0 0 10px 0; color: #0d9488;">⚡ Priority Processing</h4>
              <p style="margin: 0; color: #6b7280;">Your images get processed first in the queue for faster results.</p>
            </div>

            <div class="feature">
              <h4 style="margin: 0 0 10px 0; color: #0d9488;">🎁 Early Access</h4>
              <p style="margin: 0; color: #6b7280;">Be the first to try new features and AI models as we release them.</p>
            </div>

            <center>
              <a href="https://picforge.com/editor" class="cta-button">Start Creating Now →</a>
            </center>

            <h3>Subscription Details:</h3>
            <ul>
              <li><strong>Plan:</strong> PicForge Pro</li>
              <li><strong>Price:</strong> $9.99/month</li>
              <li><strong>Billing Date:</strong> 23rd of each month</li>
              <li><strong>Payment Method:</strong> •••• 4242</li>
            </ul>

            <h3>Manage Your Subscription:</h3>
            <p>You can manage your subscription, update payment methods, or cancel anytime from your <a href="https://picforge.com/profile">account settings</a>.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <h3>Need Help?</h3>
            <p>Have questions or need assistance? Just reply to this email or visit our <a href="https://picforge.com/tips">Help Center</a>.</p>

            <p>Thank you for upgrading! We can't wait to see what you create.</p>

            <p><strong>The PicForge Team</strong></p>
          </div>

          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p>
              <a href="https://picforge.com/profile">Manage Subscription</a> |
              <a href="https://billing.stripe.com/p/login/test_xxx">View Invoice</a> |
              <a href="https://picforge.com">PicForge.com</a>
            </p>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      results.push({
        template: 'Pro Upgrade Confirmation',
        passed: false,
        message: 'Failed to send',
        error: error.message
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${error.message}`);
    } else {
      results.push({
        template: 'Pro Upgrade Confirmation',
        passed: true,
        message: 'Sent successfully',
        emailId: data?.id
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Pro upgrade email sent`);
      console.log(`  Email ID: ${data?.id}`);
    }
  } catch (error) {
    results.push({
      template: 'Pro Upgrade Confirmation',
      passed: false,
      message: 'Exception occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

function printSummary() {
  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}EMAIL TESTING SUMMARY${colors.reset}`);
  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  console.log(`${colors.bold}Results by Template:${colors.reset}\n`);
  results.forEach(result => {
    const icon = result.passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`${icon} ${result.template}: ${result.message}`);
    if (result.emailId) {
      console.log(`  Email ID: ${result.emailId}`);
    }
    if (result.error) {
      console.log(`  ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  });

  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  if (failed === 0) {
    console.log(`${colors.green}${colors.bold}✓ ALL EMAILS SENT SUCCESSFULLY${colors.reset}`);
    console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
    console.log(`1. Check inbox: ${TEST_EMAIL}`);
    console.log(`2. Verify emails in Gmail, Outlook, Yahoo`);
    console.log(`3. Test unsubscribe links`);
    console.log(`4. Check mobile rendering`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ SOME EMAILS FAILED - CHECK ERRORS ABOVE${colors.reset}`);
  }

  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║             PicForge Email Testing Suite                 ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  console.log(`\nTest email address: ${colors.cyan}${TEST_EMAIL}${colors.reset}`);
  console.log('\nThis script will send 4 test emails:\n');
  console.log('  1. Welcome email (on signup)');
  console.log('  2. Rate limit warning (at 15 images)');
  console.log('  3. Daily limit reached (at 20 images)');
  console.log('  4. Pro upgrade confirmation\n');

  console.log('Starting tests...\n');

  await sendWelcomeEmail();
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between emails

  await sendRateLimitWarning();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await sendDailyLimitReached();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await sendProUpgradeConfirmation();

  printSummary();
}

// Validate environment
if (!process.env.RESEND_API_KEY) {
  console.error(`${colors.red}Error: RESEND_API_KEY not found in environment variables${colors.reset}`);
  console.log('\nAdd to .env.local:');
  console.log('RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx\n');
  process.exit(1);
}

// Run tests
main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
