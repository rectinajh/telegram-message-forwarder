// Example configuration file - copy this to config.js and modify as needed

module.exports = {
  // Telegram API credentials
  apiId: 20849648,
  apiHash: "04191fb4fe0806c49db30c8218475802",
  
  // Session configuration
  sessionName: "forwarder_session",
  
  // Forwarding rules configuration
  forwardingRules: [
    {
      // Example 1: Forward crypto news with keyword filtering
      source: "@cryptonews_group",        // Source group username
      target: "@my_crypto_updates",       // Target channel username
      keywords: ["bitcoin", "ethereum", "trading", "price"],  // Only forward messages with these keywords
      excludeKeywords: ["scam", "spam", "advertisement"],     // Skip messages with these words
      forwardMedia: true,                 // Forward images, videos, etc.
      addAttribution: true,               // Add "From: GroupName" header
      forwardDelay: 2000                  // 2 second delay between forwards
    },
    
    {
      // Example 2: Forward all messages from a specific group
      source: "@tech_discussions",        // Source group
      target: "@my_tech_backup",          // Target channel
      keywords: [],                       // No keyword filtering (forward all)
      excludeKeywords: ["politics"],      // But exclude political discussions
      forwardMedia: true,
      addAttribution: true,
      forwardDelay: 1000                  // 1 second delay
    },
    
    {
      // Example 3: Using chat IDs instead of usernames
      source: "-1001234567890",           // Group chat ID (get from logs)
      target: "-1005678901234",           // Channel chat ID
      keywords: ["important", "urgent"],  // Only forward important messages
      excludeKeywords: [],
      forwardMedia: false,                // Text only, no media
      addAttribution: false,              // No attribution header
      forwardDelay: 500                   // Faster forwarding
    },
    
    {
      // Example 4: Stock/Trading signals forwarding
      source: "@trading_signals_vip",
      target: "@my_trading_channel",
      keywords: ["buy", "sell", "long", "short", "signal"],
      excludeKeywords: ["scam", "fake"],
      forwardMedia: true,
      addAttribution: true,
      forwardDelay: 3000                  // Slower to avoid rate limits
    },
    
    {
      // Example 5: News aggregation
      source: "Breaking News Channel",    // Using group title instead of username
      target: "@my_news_feed",
      keywords: [],                       // Forward all news
      excludeKeywords: ["celebrity", "entertainment"],  // Skip entertainment news
      forwardMedia: true,
      addAttribution: true,
      forwardDelay: 2000
    }
  ],
  
  // General settings
  settings: {
    // Maximum retries for failed operations
    maxRetries: 3,
    // Retry delay (milliseconds)
    retryDelay: 5000,
    // Log level: 'info', 'debug', 'error'
    logLevel: 'info',
    // Enable/disable console logging
    enableLogging: true
  }
};

/*
CONFIGURATION TIPS:

1. SOURCE/TARGET FORMATS:
   - Username: "@groupname" or "@channelname"
   - Chat ID: -1001234567890 (for groups) or -1005678901234 (for channels)
   - Title: "Exact Group Name" (case sensitive)

2. FINDING CHAT IDS:
   - Run the bot once and check logs for available chats
   - Use @userinfobot on Telegram
   - Check group/channel info in Telegram apps

3. KEYWORDS:
   - Use lowercase for better matching
   - Keywords are matched using includes() - partial matches work
   - Empty array [] means no filtering

4. PERMISSIONS:
   - Ensure your account has access to source groups
   - You must be admin in target channels to send messages
   - Some groups may restrict message forwarding

5. RATE LIMITING:
   - Increase forwardDelay for high-traffic groups
   - Telegram limits: ~30 messages per second, 20 different chats per minute
   - Use delays of 1000-3000ms for safety

6. TESTING:
   - Start with one rule and test thoroughly
   - Use logLevel: 'debug' for detailed logging
   - Monitor for errors in the first few minutes
*/ 