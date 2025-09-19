// Google Apps Script Webhook for MenuSparks → Pour Plan Integration
// Deploy this as a Google Apps Script Web App

// Configuration
const CONFIG = {
  POUR_PLAN_URL: 'https://the-pour-plan-572679920581.us-west1.run.app/',
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY', // Same key used by Pour Plan
  SPREADSHEET_ID: 'YOUR_GOOGLE_SHEET_ID', // For tracking orders
  EMAIL_TEMPLATE_ID: 'YOUR_GOOGLE_DOC_TEMPLATE_ID', // For email template
};

// Main webhook handler for Stripe/payment processor
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Log the purchase
    logPurchase(data);

    // Check if it's a "5 Weekly Specials" purchase
    if (isWeeklySpecialsPurchase(data)) {
      // Generate specials immediately using Pour Plan logic
      const specials = generateWeeklySpecials(data.customer);

      // Send results to customer
      sendSpecialsEmail(data.customer.email, specials);

      // Store in Google Sheets for record
      saveSpecialsToSheet(data.customer, specials);

      return ContentService
        .createTextOutput(JSON.stringify({success: true, message: 'Specials generated and sent'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Handle other product types
    return handleOtherProducts(data);

  } catch (error) {
    console.error('Webhook error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Check if this is a weekly specials purchase
function isWeeklySpecialsPurchase(data) {
  // Check product name/ID from Stripe metadata
  const productName = data.line_items?.[0]?.description || '';
  const metadata = data.metadata || {};

  return productName.includes('Weekly Specials') ||
         productName.includes('5 specials') ||
         metadata.product_type === 'weekly_specials';
}

// Generate weekly specials using Pour Plan's AI logic
function generateWeeklySpecials(customer) {
  const prompts = [
    generateMondaySpecial(customer),
    generateTuesdaySpecial(customer),
    generateWednesdaySpecial(customer),
    generateThursdaySpecial(customer),
    generateFridaySpecial(customer)
  ];

  const specials = [];

  prompts.forEach((prompt, index) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const special = callGeminiAI(prompt);
    specials.push({
      day: dayNames[index],
      ...special
    });
  });

  return specials;
}

// Generate Monday special (focus on starting the week strong)
function generateMondaySpecial(customer) {
  const restaurantType = customer.metadata?.restaurant_type || 'casual dining';
  const priceRange = customer.metadata?.price_range || 'moderate';

  return `Create a Monday drink special for a ${restaurantType} establishment with ${priceRange} pricing.

    Requirements:
    - Name should reference Monday or beginning of week
    - Include a catchy tagline
    - Price point that attracts customers on typically slow day
    - Easy to batch prepare
    - Uses common bar ingredients

    Format the response as JSON with:
    {
      "name": "special name",
      "description": "brief description",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "price": "$X.XX",
      "tagline": "catchy marketing phrase",
      "prep_notes": "bartender instructions",
      "social_media_post": "Instagram/Facebook ready text"
    }`;
}

// Generate Tuesday special (Taco Tuesday theme)
function generateTuesdaySpecial(customer) {
  return `Create a Tuesday drink special with a Taco Tuesday or Mexican theme.

    Requirements:
    - Margarita variation or Mexican-inspired cocktail
    - Pair well with tacos/Mexican food
    - Include special Tuesday pricing
    - Fun, social media worthy name

    Format the response as JSON with same structure as before.`;
}

// Generate Wednesday special (Hump Day/Wine Wednesday)
function generateWednesdaySpecial(customer) {
  return `Create a Wednesday special focusing on "Hump Day" or "Wine Wednesday" theme.

    Requirements:
    - Mid-week pick-me-up concept
    - Could be wine-based or cocktail
    - Appeals to after-work crowd
    - Shareable/social aspect

    Format the response as JSON with same structure as before.`;
}

// Generate Thursday special (Thirsty Thursday)
function generateThursdaySpecial(customer) {
  return `Create a Thursday special for "Thirsty Thursday".

    Requirements:
    - Higher energy than early week
    - Pre-weekend vibe
    - Group-friendly option
    - Instagram-worthy presentation

    Format the response as JSON with same structure as before.`;
}

// Generate Friday special (TGIF/Weekend kickoff)
function generateFridaySpecial(customer) {
  return `Create a Friday special celebrating the weekend.

    Requirements:
    - Premium/signature cocktail
    - Celebration worthy
    - Higher price point acceptable
    - Memorable and shareworthy
    - Perfect for date night or groups

    Format the response as JSON with same structure as before.`;
}

// Call Gemini AI API
function callGeminiAI(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    const text = result.candidates[0].content.parts[0].text;

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if JSON parsing fails
    return {
      name: "Special Cocktail",
      description: text.substring(0, 100),
      price: "$8.00",
      tagline: "Today's Special",
      ingredients: ["various"],
      prep_notes: "See description",
      social_media_post: text.substring(0, 200)
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}

// Send email with generated specials
function sendSpecialsEmail(email, specials) {
  const htmlContent = createEmailHTML(specials);

  MailApp.sendEmail({
    to: email,
    subject: '🍹 Your 5 Weekly Drink Specials Are Ready!',
    htmlBody: htmlContent,
    name: 'MenuSparks'
  });
}

// Create HTML email content
function createEmailHTML(specials) {
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Your Weekly Drink Specials</h1>
      <p style="color: #666; text-align: center;">Fresh, AI-generated specials delivered instantly!</p>
      <hr style="border: 1px solid #eee;">
  `;

  specials.forEach(special => {
    html += `
      <div style="margin: 20px 0; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #2c5282;">${special.day}: ${special.name}</h2>
        <p style="color: #e53e3e; font-size: 24px; font-weight: bold;">${special.price}</p>
        <p style="color: #4a5568; font-style: italic;">"${special.tagline}"</p>
        <p style="color: #4a5568;">${special.description}</p>
        <h4 style="color: #2c5282;">Ingredients:</h4>
        <ul style="color: #4a5568;">
          ${special.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <div style="background: #fff; padding: 10px; border-left: 3px solid #3182ce; margin: 10px 0;">
          <strong>Prep Notes:</strong> ${special.prep_notes}
        </div>
        <div style="background: #e6fffa; padding: 10px; border-radius: 5px; margin: 10px 0;">
          <strong>📱 Social Media Post:</strong><br>
          ${special.social_media_post}
        </div>
      </div>
    `;
  });

  html += `
      <hr style="border: 1px solid #eee;">
      <p style="color: #666; text-align: center; font-size: 12px;">
        Generated by MenuSparks + The Pour Plan<br>
        Need changes? Reply to this email for support.
      </p>
    </div>
  `;

  return html;
}

// Save to Google Sheets
function saveSpecialsToSheet(customer, specials) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const dataSheet = sheet.getSheetByName('Weekly Specials') || sheet.insertSheet('Weekly Specials');

  // Add headers if first row
  if (dataSheet.getLastRow() === 0) {
    dataSheet.appendRow([
      'Date', 'Customer Email', 'Restaurant', 'Monday', 'Tuesday',
      'Wednesday', 'Thursday', 'Friday', 'Status'
    ]);
  }

  // Add the specials data
  dataSheet.appendRow([
    new Date(),
    customer.email,
    customer.metadata?.restaurant_name || 'Unknown',
    specials[0]?.name || '',
    specials[1]?.name || '',
    specials[2]?.name || '',
    specials[3]?.name || '',
    specials[4]?.name || '',
    'Delivered'
  ]);
}

// Log all purchases
function logPurchase(data) {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const logSheet = sheet.getSheetByName('Purchase Log') || sheet.insertSheet('Purchase Log');

  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(['Timestamp', 'Customer Email', 'Product', 'Amount', 'Status']);
  }

  logSheet.appendRow([
    new Date(),
    data.customer?.email || 'Unknown',
    data.line_items?.[0]?.description || 'Unknown Product',
    data.amount_total / 100, // Convert from cents
    'Processed'
  ]);
}

// Handle other product types
function handleOtherProducts(data) {
  // Add logic for other MenuSparks products here
  return ContentService
    .createTextOutput(JSON.stringify({success: true, message: 'Purchase logged'}))
    .setMimeType(ContentService.MimeType.JSON);
}