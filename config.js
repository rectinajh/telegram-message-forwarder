module.exports = {
  // Telegram API credentials
  apiId: 20849648,
  apiHash: "04191fb4fe0806c49db30c8218475802",
  
  // Session configuration
  sessionName: "forwarder_session",
  
  // Forwarding rules configuration
  forwardingRules: [
    {
      // Source: Using group title for invite link groups
      source: "PF forwarding", // Group name from invite link: https://t.me/+5lug4f3wbWI3ZjE0
      // Target: Set to your channel name
      target: "jack hua", // Target channel name
      // Optional: filter messages by keywords (case insensitive)
      keywords: [], // Example: ["crypto", "trading"]
      // Optional: exclude messages with certain keywords
      excludeKeywords: [], // Example: ["spam", "advertisement"]
      // Forward media (photos, videos, documents)
      forwardMedia: true,
      // Add attribution (source group name)
      addAttribution: true,
      // Delay between forwards (milliseconds) to avoid rate limiting
      forwardDelay: 2000
    }
    // Add more forwarding rules as needed
    // {
    //   source: "@another_source",
    //   target: "@another_target",
    //   keywords: ["specific", "keywords"],
    //   excludeKeywords: [],
    //   forwardMedia: true,
    //   addAttribution: true,
    //   forwardDelay: 1000
    // }
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