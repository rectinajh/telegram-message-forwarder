# Telegram Message Forwarder

A reliable Telegram message forwarding bot built with GramJS that automatically forwards messages from Telegram groups to private channels.

## Features

- ✅ **Reliable Message Forwarding**: Auto-forward messages from multiple groups to channels
- ✅ **Media Support**: Forward photos, videos, documents, and other media files
- ✅ **Smart Filtering**: Filter messages by keywords or exclude unwanted content
- ✅ **Attribution**: Add source group information to forwarded messages
- ✅ **Rate Limiting**: Built-in delays to prevent API rate limits
- ✅ **Retry Logic**: Automatic retries for failed operations
- ✅ **Session Management**: Persistent login sessions
- ✅ **Flexible Configuration**: Support for multiple forwarding rules

## Prerequisites

- Node.js 16.0.0 or higher
- Telegram API credentials (API ID and API Hash)
- Access to source groups and target channels

## Installation

1. **Clone or download this project**
```bash
git clone <your-repo-url>
cd telegram-message-forwarder
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your settings**
   - Edit `config.js` with your API credentials and forwarding rules
   - Replace placeholder values with actual group/channel usernames or IDs

## Configuration

### API Credentials

Your API credentials are already configured in `config.js`:
- **API ID**: `20849648`
- **API Hash**: `04191fb4fe0806c49db30c8218475802`

### Forwarding Rules

Edit the `forwardingRules` array in `config.js`:

```javascript
forwardingRules: [
  {
    source: "@source_group_username",    // Source group username/ID
    target: "@target_channel_username",  // Target channel username/ID
    keywords: [],                        // Filter by keywords (optional)
    excludeKeywords: [],                 // Exclude messages with these keywords
    forwardMedia: true,                  // Forward media files
    addAttribution: true,                // Add "From: GroupName" to messages
    forwardDelay: 2000                   // Delay between forwards (ms)
  }
]
```

### Finding Group/Channel IDs

You can use:
- **Username**: `@groupname` or `@channelname`
- **Chat ID**: Numeric ID (e.g., `-1001234567890`)
- **Group Title**: Exact group name (e.g., "My Awesome Group")

## Usage

### First Time Setup

1. **Start the forwarder**
```bash
npm start
```

2. **Authentication Process**
   - Enter your phone number when prompted
   - Enter the verification code sent to Telegram
   - Enter your 2FA password if enabled

3. **Session Saving**
   - Your session will be saved automatically
   - Future runs won't require re-authentication

### Running the Forwarder

```bash
# Start forwarding
npm start

# Run with debugging
npm run dev
```

### Stopping the Forwarder

Press `Ctrl+C` to gracefully stop the forwarder.

## Example Configuration

Here's a practical example of `config.js`:

```javascript
forwardingRules: [
  {
    // Forward crypto news from a public group to your private channel
    source: "@cryptonews_public",
    target: "@my_crypto_channel",
    keywords: ["bitcoin", "ethereum", "trading"],
    excludeKeywords: ["spam", "scam"],
    forwardMedia: true,
    addAttribution: true,
    forwardDelay: 3000
  },
  {
    // Forward all messages from a specific group
    source: "-1001234567890",  // Group chat ID
    target: "@backup_channel",
    keywords: [],  // No filtering
    excludeKeywords: [],
    forwardMedia: true,
    addAttribution: false,
    forwardDelay: 1000
  }
]
```

## Advanced Features

### Keyword Filtering

- **Include Keywords**: Only forward messages containing specific words
- **Exclude Keywords**: Skip messages containing unwanted words
- **Case Insensitive**: All keyword matching is case-insensitive

### Media Forwarding

- Supports photos, videos, documents, stickers, and voice messages
- Original media quality is preserved
- Captions are forwarded with media

### Attribution

When enabled, adds source information to forwarded messages:
```
📢 From: Source Group Name

Original message content here...
```

### Rate Limiting

- Configurable delays between forwards
- Automatic retry with exponential backoff
- Respects Telegram API limits

## Troubleshooting

### Common Issues

1. **"Entity not found" error**
   - Verify group/channel usernames are correct
   - Ensure the bot has access to source groups
   - Try using chat IDs instead of usernames

2. **Authentication failed**
   - Double-check API ID and API Hash
   - Ensure phone number format is correct (+1234567890)
   - Try deleting the session file and re-authenticating

3. **Messages not forwarding**
   - Check if the bot has admin permissions in target channels
   - Verify forwarding rules are correctly configured
   - Check console logs for error messages

### Getting Chat IDs

To find chat IDs, you can temporarily add this code to log all your chats:

```javascript
// Add to forwarder.js after client initialization
const dialogs = await this.client.getDialogs();
dialogs.forEach(dialog => {
  console.log(`${dialog.title}: ${dialog.entity.id}`);
});
```

### Session Issues

If you encounter session problems:
1. Delete the `.session` file
2. Restart the application
3. Complete authentication again

## Security Notes

- Never share your API credentials
- Keep your session file private
- Use environment variables for sensitive data in production
- Regularly monitor forwarded content for compliance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review console logs for errors
3. Ensure all dependencies are properly installed
4. Verify your Telegram API credentials

---

**Note**: This tool is for educational and personal use. Ensure compliance with Telegram's Terms of Service and respect user privacy when forwarding messages. 