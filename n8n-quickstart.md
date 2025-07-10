# 🚀 n8n Quickstart Guide

## Goal
Use n8n to automatically forward messages from the "PF forwarding" group to the "jack hua" channel.

## Quick Steps

### 1. Start n8n
```bash
./start-n8n.sh
```
or
```bash
npx n8n
```

Open in your browser: http://localhost:5678

### 2. Create a Telegram Bot

1. Search for `@BotFather` in Telegram
2. Send `/newbot` command
3. Set a bot name (e.g., `PF Forwarder Bot`)
4. Set a bot username (e.g., `pf_forwarder_bot`)
5. Copy the Bot Token (e.g., `1234567890:ABCdefGHI...`)

### 3. Set Bot Permissions

Send to @BotFather:
```
/setprivacy
Select your bot
Choose Disable

/setjoingroups
Select your bot
Choose Enable
```

### 4. Import the Workflow

1. In n8n UI, click "Import from File"
2. Select `telegram-forwarder-workflow.json`
3. Click "Import"

### 5. Configure Credentials

1. Click the "Telegram Trigger" node
2. Click "Create New" in credentials
3. Enter:
   - **Name**: `Telegram Bot API`
   - **Access Token**: `Your Bot Token`
4. Click "Save"

### 6. Add Bot to Group

1. Add your bot to the "PF forwarding" group
2. Make sure the bot can read messages

### 7. Activate the Workflow

1. Toggle the "Inactive" switch in the top right
2. It should become "Active"

### 8. Test

1. Send a test message in the "PF forwarding" group
2. Check if the "jack hua" channel receives the forwarded message

## Workflow Explanation

### Node Flow:
1. **Telegram Trigger** - Receives all Telegram messages
2. **Filter PF Forwarding Group** - Only processes messages from "PF forwarding" group
3. **Format Message** - Formats the message and adds source info
4. **Check Media Type** - Checks for media files
5. **Send Text Message** - Sends plain text messages
6. **Send Photo** - Sends photo messages
7. **Send Other Media** - Sends other media files

### Message Format:
```
📢 From: PF forwarding
👤 User: username

Original message content...
```

## Customization

### Change Target Channel
In the "Format Message" node, change this line:
```javascript
chat_id: 'jack hua', // Replace with your target channel name or ID
```

### Change Source Group
In the "Filter PF Forwarding Group" node, change the condition:
```javascript
value2: "PF forwarding" // Replace with your source group name
```

### Add Keyword Filtering
After the "Filter PF Forwarding Group" node, add a new IF node:
```javascript
const messageText = $json.message.text || '';
const keywords = ['crypto', 'bitcoin', 'trading'];
return keywords.some(keyword => 
  messageText.toLowerCase().includes(keyword.toLowerCase())
);
```

## Troubleshooting

### 1. Group or Channel Not Found
- Make sure the bot is added to the source group
- Make sure the bot is an admin in the target channel
- Try using the Chat ID instead of the name

### 2. Workflow Not Triggered
- Check if the workflow is active
- Make sure the Bot Token is correct
- Check the execution logs for errors

### 3. Get Chat ID
Add a temporary Function node in the workflow:
```javascript
console.log('Chat ID:', $json.message.chat.id);
console.log('Chat Title:', $json.message.chat.title);
return $input.all();
```

## Monitoring

1. In n8n UI, go to the "Executions" page
2. Monitor successful/failed executions
3. View detailed execution logs

## Done!

Your Telegram message forwarding workflow is now set up! Every time the "PF forwarding" group receives a new message, it will be automatically forwarded to the "jack hua" channel.

## Advanced Features

- Add message filtering (keywords, users, etc.)
- Set forwarding delay
- Add message statistics
- Integrate with other services (email, Slack, etc.)

See `n8n-setup.md` for more advanced configuration options! 