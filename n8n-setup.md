# 🤖 n8n + Telegram Workflow Setup Guide

## Overview
Use n8n to create an automation workflow that is triggered by Telegram group messages and forwards them to a specified channel.

## Step 1: Install n8n

### Method 1: Install via npm
```bash
npm install n8n -g
```

### Method 2: Install via Docker
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Method 3: Run with npx (recommended)
```bash
npx n8n
```

## Step 2: Start n8n

```bash
npx n8n
# or if installed globally
n8n
```

Open: http://localhost:5678

## Step 3: Create a Telegram Bot

1. Search for `@BotFather` in Telegram
2. Send `/newbot` command
3. Follow the prompts to set the bot name and username
4. Get the Bot Token (e.g., `1234567890:ABCdefGHIjklMNOpqrSTUvwxyz`)

### Set Bot Permissions
```
/setprivacy - Set to Disabled (allow all messages in groups)
/setjoingroups - Set to Enabled (allow joining groups)
/setcommands - Set commands (optional)
```

## Step 4: Set up Telegram Trigger

### 1. Create a new workflow
1. Open n8n UI
2. Click "New Workflow"
3. Delete the default "Start" node

### 2. Add Telegram Trigger node
1. Click "+" to add a node
2. Search for "Telegram"
3. Select "Telegram Trigger"

### 3. Configure Telegram Trigger
```json
{
  "credentials": "Telegram Bot API",
  "webhook": true,
  "updates": ["message"],
  "additionalFields": {
    "download": false
  }
}
```

### 4. Set Telegram Credentials
1. Click on "Telegram Bot API" credentials
2. Click "Create New"
3. Enter:
   - Name: `My Telegram Bot`
   - Access Token: `Your Bot Token`
4. Save

## Step 5: Create Forwarding Logic

### 1. Add IF node to filter group
In the IF node, use:
```javascript
{{ $json.message.chat.title }} === "PF forwarding"
```

### 2. Add Telegram Send node
1. Add "Telegram" node (Send Message)
2. Configure:
   - Operation: Send Message
   - Chat ID: `Your target channel ID`
   - Text: `{{ $json.message.text }}`

### 3. Add Format node (optional)
```javascript
const originalMessage = $input.first();
const sourceChat = originalMessage.json.message.chat.title;
const messageText = originalMessage.json.message.text;
const userName = originalMessage.json.message.from.first_name;

return [{
  json: {
    formatted_message: `📢 From: ${sourceChat}\n👤 User: ${userName}\n\n${messageText}`
  }
}];
```

## Example Workflow

```json
{
  "nodes": [
    {
      "parameters": {
        "updates": ["message"],
        "additionalFields": {}
      },
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "auto-generated",
      "credentials": {
        "telegramApi": "telegram_bot_credentials"
      }
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.message.chat.title}}",
              "operation": "equal",
              "value2": "PF forwarding"
            }
          ]
        }
      },
      "name": "Filter Source Group",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [440, 300]
    },
    {
      "parameters": {
        "functionCode": "const message = $input.first();\nconst sourceChat = message.json.message.chat.title;\nconst messageText = message.json.message.text || '[media]';\nconst userName = message.json.message.from.first_name || 'Unknown';\n\nreturn [{\n  json: {\n    chat_id: 'jack hua',\n    text: `📢 From: ${sourceChat}\\n👤 User: ${userName}\\n\\n${messageText}`\n  }\n}];"
      },
      "name": "Format Message",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [640, 300]
    },
    {
      "parameters": {
        "operation": "sendMessage",
        "chatId": "={{$json.chat_id}}",
        "text": "={{$json.text}}"
      },
      "name": "Send to Target Channel",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1,
      "position": [840, 300],
      "credentials": {
        "telegramApi": "telegram_bot_credentials"
      }
    }
  ],
  "connections": {
    "Telegram Trigger": {
      "main": [
        [
          {
            "node": "Filter Source Group",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Source Group": {
      "main": [
        [
          {
            "node": "Format Message",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Message": {
      "main": [
        [
          {
            "node": "Send to Target Channel",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Step 6: Activate and Test

1. Activate the workflow (toggle "Active")
2. Add your bot to the "PF forwarding" group
3. Make sure the bot has permission to read messages
4. Send a test message in the group
5. Check if the message is forwarded to the target channel

## Troubleshooting

1. **Webhook not set**
   - Make sure the workflow is active
   - Check Telegram Trigger configuration
2. **Bot has no permission**
   - Make sure the bot is in the group and can read messages
   - Check privacy settings
3. **Target channel not found**
   - Use channel Chat ID instead of name
   - Make sure the bot is an admin in the channel

### Get Chat ID
```javascript
console.log('Chat ID:', $json.message.chat.id);
console.log('Chat Title:', $json.message.chat.title);
return $input.all();
```

## Advanced

1. **Media forwarding**
```javascript
if ($json.message.photo) {
  return [{
    json: {
      operation: 'sendPhoto',
      chat_id: 'target_channel',
      photo: $json.message.photo[0].file_id,
      caption: `📢 From: ${$json.message.chat.title}`
    }
  }];
}
```
2. **Keyword filtering**
```javascript
const messageText = $json.message.text || '';
const keywords = ['bitcoin', 'crypto', 'trading'];
const hasKeyword = keywords.some(keyword => 
  messageText.toLowerCase().includes(keyword.toLowerCase())
);
return hasKeyword;
```
3. **Delay**
Add a "Wait" node to control forwarding rate:
```json
{
  "parameters": {
    "amount": 2,
    "unit": "seconds"
  },
  "name": "Wait",
  "type": "n8n-nodes-base.wait"
}
```

Now you can start n8n and create this workflow!

## Checklist
- [ ] Install n8n
- [ ] Create Telegram Bot
- [ ] Configure Telegram Trigger
- [ ] Set up forwarding logic
- [ ] Test the workflow
- [ ] Monitor execution logs 