/**
 * Test Email Templates Script
 *
 * Tests all email templates by sending them to derek.bobola@gmail.com
 * Run with: npx tsx scripts/test-email.ts
 */

const TEST_EMAIL = 'derek.bobola@gmail.com';
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://pic-forge.com/api/send-email'
  : 'http://localhost:3000/api/send-email';

interface EmailTest {
  type: string;
  data: any;
  description: string;
}

const emailTests: EmailTest[] = [
  {
    type: 'welcome',
    data: {
      userName: 'Derek',
      userEmail: TEST_EMAIL,
    },
    description: 'Welcome email for new user signup',
  },
  {
    type: 'limit-warning',
    data: {
      userName: 'Derek',
      remainingImages: 5,
    },
    description: 'Warning when user has 5 images left',
  },
  {
    type: 'limit-reached',
    data: {
      userName: 'Derek',
      resetTime: 'in 8 hours',
    },
    description: 'Notification when daily limit is reached',
  },
  {
    type: 'promo-redeemed',
    data: {
      userName: 'Derek',
      promoCode: 'DEREK-FOUNDER-2025',
      tier: 'unlimited',
    },
    description: 'Confirmation when promo code is redeemed',
  },
  {
    type: 'pro-upgrade',
    data: {
      userName: 'Derek',
      subscriptionId: 'sub_test123abc',
      planName: 'Pro',
      amount: '$9.00',
    },
    description: 'Confirmation when user upgrades to Pro',
  },
  {
    type: 'weekly-digest',
    data: {
      userName: 'Derek',
      totalTransformations: 47,
      favoritePrompts: [
        'Turn into a zombie',
        'Van Gogh painting style',
        'Banksy street art',
        'Cyberpunk 2077 aesthetic',
        'Studio Ghibli animation',
      ],
      topImages: [
        {
          originalUrl: 'https://picsum.photos/400/300',
          transformedUrl: 'https://picsum.photos/400/301',
          prompt: 'Turn into a zombie',
        },
        {
          originalUrl: 'https://picsum.photos/400/302',
          transformedUrl: 'https://picsum.photos/400/303',
          prompt: 'Van Gogh painting style',
        },
      ],
      weekStart: 'Oct 16, 2025',
      weekEnd: 'Oct 23, 2025',
    },
    description: 'Weekly summary of user activity',
  },
];

async function sendTestEmail(test: EmailTest): Promise<boolean> {
  try {
    console.log(`\n📧 Sending ${test.type} email...`);
    console.log(`   Description: ${test.description}`);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: TEST_EMAIL,
        type: test.type,
        data: test.data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`   ❌ Failed:`, error);
      return false;
    }

    const result = await response.json();
    console.log(`   ✅ Success:`, result.message);
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return false;
  }
}

async function testAllEmails() {
  console.log('🚀 PicForge Email Testing Suite');
  console.log('================================');
  console.log(`Test recipient: ${TEST_EMAIL}`);
  console.log(`API URL: ${API_URL}`);
  console.log(`Total tests: ${emailTests.length}`);

  const results = {
    passed: 0,
    failed: 0,
    total: emailTests.length,
  };

  for (const test of emailTests) {
    const success = await sendTestEmail(test);
    if (success) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Wait 1 second between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n================================');
  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${results.passed}/${results.total}`);
  console.log(`   ❌ Failed: ${results.failed}/${results.total}`);
  console.log(`   📈 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Check your inbox at:', TEST_EMAIL);
  } else {
    console.log('\n⚠️  Some tests failed. Review the errors above.');
  }

  console.log('\n📝 Testing Tips:');
  console.log('   1. Verify emails are not in spam folder');
  console.log('   2. Check that all links work correctly');
  console.log('   3. Test unsubscribe links');
  console.log('   4. Verify mobile responsiveness');
  console.log('   5. Check that images load properly');
}

// Run tests
console.log('\n⚠️  IMPORTANT: Make sure your dev server is running!');
console.log('   Run: npm run dev\n');

setTimeout(() => {
  testAllEmails().catch(console.error);
}, 2000);
