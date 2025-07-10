// test-parse.js
const { parseSnapshotMessage } = require('./openai-parser');

const testMessage = `🚀 New Token: $XYZ | MC: 2.1M | Liquidity: 120k | Holders: 1,200`;

parseSnapshotMessage(testMessage).then(result => {
  console.log('Parsed result:', result);
});