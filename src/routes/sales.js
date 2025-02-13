const express = require('express');
const axios = require('axios');
const { computeAnalytics } = require('../analytics');
const router = express.Router();

/**
 * POST /sales/insights
 * Expects a JSON payload with an array of sales records.
 */
router.post('/insights', async (req, res) => {
  try {
    const { sales } = req.body;

    // 1) Validate array
    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty sales array.' });
    }

    // 2) Validate each record
    for (const [index, record] of sales.entries()) {
      if (!record || typeof record.category === 'undefined' || typeof record.amount === 'undefined') {
        return res.status(400).json({
          error: `Invalid record at index ${index}: missing 'category' or 'amount'`
        });
      }
      if (typeof record.category !== 'string' || !record.category.trim()) {
        return res.status(400).json({
          error: `Invalid record at index ${index}: 'category' must be a non-empty string.`
        });
      }
      if (typeof record.amount !== 'number' || record.amount < 0) {
        return res.status(400).json({
          error: `Invalid record at index ${index}: 'amount' must be a non-negative number.`
        });
      }
    }

    // 3) Compute analytics
    const analytics = computeAnalytics(sales);

    // 4) Generate summary (mocked in tests)
    const summary = await generateAISummary(analytics);

    return res.json({ analytics, summary });
  } catch (error) {
    console.error('Error in /sales/insights route:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
});

/**
 * generateAISummary: generates a summary for the given analytics data.
 * This could integrate with an AI service like OpenAI or provide a fallback.
 */
async function generateAISummary(analytics) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return 'No AI API key provided. Please configure OPENAI_API_KEY.';
  }

  try {
    const summaryContent = `
        I have the following analytics data:
        - Total Sales: ${analytics.totalSales}
        - Average Sales: ${analytics.averageSales}
        - Best Category: ${analytics.bestCategory}
        - Sales Per Category: ${JSON.stringify(analytics.salesPerCategory)}

        Provide a concise summary of these insights in a human-friendly tone.
      `;

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: summaryContent.trim()
        },
        {
          role: 'user',
          content: summaryContent.trim()
        }
      ],
      max_tokens: 100
    };

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    // The returned text is typically in response.data.choices[0].message.content
    const summaryText = response.data.choices[0].message.content.trim();
    return summaryText;
  } catch (err) {
    console.error('AI API call failed:', err.message);
    return 'Unable to generate AI summary at this time.';
  }
}

module.exports = router;
