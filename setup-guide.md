# 🔧 PF forwarding Group Setup Guide

## 📋 Group Info
- **Group Name**: PF forwarding
- **Invite Link**: https://t.me/+5lug4f3wbWI3ZjE0
- **Config Status**: ✅ Added to config.js

## 🚀 Quick Setup Steps

### 1. Join the Source Group
First, join the group using the invite link:
```
https://t.me/+5lug4f3wbWI3ZjE0
```

### 2. Create or Prepare the Target Channel
Create a private channel to receive forwarded messages, or use an existing channel username.

### 3. Update Target Channel in Config
Edit the `config.js` file and replace `@your_target_channel` with your actual target channel:

```javascript
{
  source: "PF forwarding",
  target: "@your_channel_username", // Replace with your channel username
  // ... other config
}
```

### 4. Test the Connection
Run the program for the first test:
```bash
npm start
```

## 🔍 Get the Exact Group ID (Recommended)

Since group names from invite links may change, it's recommended to get the numeric ID:

### Method 1: Check Program Logs
1. Start the program; it will display all accessible groups
2. Find the numeric ID for "PF forwarding"
3. Copy the ID into the config file

### Method 2: Use a Telegram Bot
1. Search for `@userinfobot` in Telegram
2. Send the group link to the bot
3. Get the numeric group ID

## 📝 Example Configurations

### Basic (Forward All Messages)
```javascript
{
  source: "PF forwarding",
  target: "@my_backup_channel",
  keywords: [],
  excludeKeywords: [],
  forwardMedia: true,
  addAttribution: true,
  forwardDelay: 2000
}
```

### Advanced (With Filtering)
```javascript
{
  source: "PF forwarding",
  target: "@my_filtered_channel",
  keywords: ["important", "notice", "announcement"],     // Only forward messages with these keywords
  excludeKeywords: ["ad", "spam"],     // Exclude messages with these words
  forwardMedia: true,
  addAttribution: true,
  forwardDelay: 3000
}
```

### Using Numeric ID (More Stable)
```javascript
{
  source: -1001234567890,  // Actual ID from logs
  target: -1005678901234,  // Target channel numeric ID
  keywords: [],
  excludeKeywords: [],
  forwardMedia: true,
  addAttribution: true,
  forwardDelay: 2000
}
```

## ⚠️ Important Notes

### Permission Requirements
- ✅ You must be a member of the "PF forwarding" group
- ✅ You must be an admin in the target channel
- ✅ Make sure the target channel allows sending messages

### First Run Tips
1. **Authentication**: Have your Telegram phone number and code ready
2. **Monitor Logs**: Check if the group is found
3. **Test Message**: Send a test message to verify forwarding
4. **Adjust Delay**: Set `forwardDelay` based on group activity

### Troubleshooting
- If the group is not found, try using the numeric ID
- If unable to send to the channel, check admin permissions
- If authentication errors occur, delete the `.session` file and re-authenticate

## 🎯 Next Steps

1. **Configure Target Channel**: Update the `target` field in `config.js`
2. **Start the Program**: Run `npm start`
3. **Complete Authentication**: Enter your phone number and code
4. **Verify Functionality**: Send a test message to confirm forwarding

## 📞 Need Help?

If you have issues:
1. Check if `config.js` is correct
2. Review console error messages
3. Make sure you joined the source group and have admin rights in the target channel
4. See the detailed troubleshooting in `README.md`

---

✨ **Tip**: It's recommended to test with a test channel first. Once confirmed working, set your official target channel. 