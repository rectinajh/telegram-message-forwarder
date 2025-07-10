# 🚀 Quickstart Guide

## 1. Configure Forwarding Rules

Edit the `config.js` file and update the forwarding rules:

```javascript
forwardingRules: [
  {
    source: "@your_source_group",    // Replace with your source group username
    target: "@your_target_channel",  // Replace with your target channel username
    keywords: [],                    // Keyword filtering (optional)
    excludeKeywords: [],             // Exclude keywords (optional)
    forwardMedia: true,              // Whether to forward media files
    addAttribution: true,            // Whether to add source info
    forwardDelay: 2000              // Forward delay (ms)
  }
]
```

## 2. Start the Program

```bash
npm start
```

## 3. First-time Authentication

The program will prompt you to enter:
- 📱 **Phone number**: Enter your Telegram phone number (e.g., +8613812345678)
- 🔑 **Verification code**: Enter the code sent by Telegram
- 🔒 **2FA password**: If you have enabled two-step verification, enter your password

## 4. Start Monitoring

After successful authentication, the program will:
- ✅ Save the login session (no need to re-authenticate next time)
- 🔍 Monitor the configured source group(s)
- 📤 Automatically forward matching messages to the target channel

## Common Configuration Examples

### Forward Crypto News
```javascript
{
  source: "@crypto_news_group",
  target: "@my_crypto_channel", 
  keywords: ["bitcoin", "ethereum", "trading"],
  excludeKeywords: ["spam", "scam"],
  forwardMedia: true,
  addAttribution: true,
  forwardDelay: 3000
}
```

### Forward All Messages
```javascript
{
  source: "@important_group",
  target: "@backup_channel",
  keywords: [],        // Empty array = forward all messages
  excludeKeywords: [],
  forwardMedia: true,
  addAttribution: false,
  forwardDelay: 1000
}
```

## How to Get Group/Channel ID

### Method 1: Use Username
- Group: `@groupname`
- Channel: `@channelname`

### Method 2: Use Numeric ID
- Group: `-1001234567890`
- Channel: `-1005678901234`

### Method 3: Check Logs
The program will display all available groups and channels in the logs when started.

## Stop the Program

Press `Ctrl+C` to gracefully stop the program.

## Troubleshooting

### Group/Channel Not Found
- Make sure the username is correct (with @)
- Check if you have access to the group
- Try using the numeric ID instead of the username

### Unable to Send Messages
- Make sure you are an admin in the target channel
- Check if the channel allows sending messages

### Authentication Failed
- Check if API ID and API Hash are correct
- Make sure the phone number format is correct (with country code)
- Delete the `.session` file and re-authenticate

## More Configuration Options

See the `example-config.js` file for more configuration examples and detailed explanations.

---

💡 **Tip**: It is recommended to test with a test group and channel first. Once confirmed working, add more rules as needed. 