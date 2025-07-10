require('dotenv').config();
const { OpenAI } = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function parseSnapshotMessage(message) {
  const prompt = `
Extract the following fields from the message:
- Token (name or symbol)
- Liquidity (number)
- MC (Market Cap, number)
- Holder (number of holders)

Message:
${message}

Return as JSON:
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview', // or gpt-4.1-mini if available
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    max_tokens: 200,
  });

  const content = response.choices[0].message.content;
  const match = content.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      const data = JSON.parse(match[0]);
      return data;
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  }
  return null;
}

// Example: inside your message handler
async function handleNewTelegramMessage(messageText) {
  // Only parse if you want to extract snapshot data
  const parsed = await parseSnapshotMessage(messageText);
  if (parsed) {
    console.log('Extracted snapshot data:', parsed);
    // You can now use parsed.token, parsed.liquidity, etc.
  } else {
    console.log('Could not extract snapshot data.');
  }
}

module.exports = { parseSnapshotMessage };