# MenuSparks → Pour Plan Integration Setup Guide

## 🚀 Quick Start: Instant Weekly Specials Delivery

This integration automatically generates and delivers 5 weekly drink specials when someone purchases from MenuSparks.com using The Pour Plan's AI engine.

## 📋 Prerequisites

1. **Google Account** with access to:
   - Google Apps Script
   - Google Sheets
   - Gmail (for sending emails)

2. **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)

3. **Stripe Account** (or your payment processor) with webhook access

## 🔧 Setup Steps

### Step 1: Deploy the Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy the contents of `menusparks-pourplan-webhook.js`
4. Update the CONFIG section:
   ```javascript
   const CONFIG = {
     GEMINI_API_KEY: 'your-gemini-api-key-here',
     SPREADSHEET_ID: 'your-google-sheet-id',
     EMAIL_TEMPLATE_ID: 'optional-template-id'
   };
   ```

5. Deploy as Web App:
   - Click "Deploy" → "New Deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Click "Deploy"
   - Copy the Web App URL

### Step 2: Create Google Sheet for Tracking

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL
3. Add to CONFIG.SPREADSHEET_ID in the script

### Step 3: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint with your Google Apps Script URL
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Add metadata to your products:
   ```json
   {
     "product_type": "weekly_specials",
     "restaurant_type": "casual_dining",
     "price_range": "moderate"
   }
   ```

### Step 4: Test the Integration

1. Create a test purchase on MenuSparks
2. Check Google Sheet for logged purchase
3. Verify email delivery with 5 specials

## 🎯 How It Works

1. **Customer purchases** "5 Weekly Specials" on MenuSparks
2. **Stripe webhook** triggers Google Apps Script
3. **Script generates** 5 unique daily specials using Gemini AI:
   - Monday: Week-starter special
   - Tuesday: Taco Tuesday themed
   - Wednesday: Wine Wednesday/Hump Day
   - Thursday: Thirsty Thursday
   - Friday: TGIF celebration drink
4. **Email sent instantly** with all specials formatted
5. **Data logged** in Google Sheets for records

## 🎨 Customization Options

### Modify Special Generation Prompts

Edit the daily prompt functions to match your style:
```javascript
function generateMondaySpecial(customer) {
  // Customize the prompt based on your needs
  return `Your custom prompt here...`;
}
```

### Add Customer Preferences

Use Stripe metadata to personalize:
- Restaurant type (sports bar, fine dining, etc.)
- Price range
- Ingredient preferences
- Local trends

### Email Template Customization

Modify the `createEmailHTML()` function to match your brand:
- Add logo
- Custom colors
- Special formatting
- Call-to-action buttons

## 📊 Tracking & Analytics

The integration automatically tracks:
- All purchases with timestamps
- Customer information
- Generated specials by day
- Delivery status

Access your Google Sheet to see:
- Purchase Log tab: All transactions
- Weekly Specials tab: Generated content
- Analytics tab: Custom reports (add formulas)

## 🔒 Security Notes

- Keep your Gemini API key secure
- Use environment variables in production
- Limit webhook endpoint access
- Regular audit of access logs

## 🚨 Troubleshooting

### Specials not generating?
- Check Gemini API key is valid
- Verify API quotas aren't exceeded
- Check Google Apps Script logs

### Emails not sending?
- Verify Gmail quota (500/day)
- Check spam folder
- Confirm email addresses are valid

### Webhook not triggering?
- Verify webhook URL is correct
- Check Stripe webhook logs
- Ensure deployment is active

## 💡 Advanced Features

### Add More Special Types
```javascript
// Add happy hour specials
function generateHappyHourSpecials(customer) {
  // Generate 3-5 happy hour drinks
}

// Add seasonal specials
function generateSeasonalSpecials(customer, season) {
  // Generate season-appropriate drinks
}
```

### Integration with Other Services
- Connect to POS systems
- Sync with social media schedulers
- Update digital menu boards
- Send to kitchen display systems

## 📱 Mobile App Integration

For future mobile app:
1. Create REST API endpoint
2. Return JSON instead of email
3. Add authentication layer
4. Cache generated specials

## 📈 Scaling Considerations

- Batch process multiple orders
- Implement queue for high volume
- Cache common requests
- Use paid Gemini tier for more requests

## 🎉 Success Metrics

Track your automation success:
- Time saved: ~30 minutes per order
- Customer satisfaction: Instant delivery
- Consistency: AI-generated quality
- Revenue: Upsell opportunities

## 📞 Support

For issues or customization help:
- Check Google Apps Script logs
- Review Stripe webhook events
- Test with sample data
- Contact support with error messages

---

**Ready to automate!** Your customers will receive their 5 weekly specials within seconds of purchase! 🍹✨