const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');

class TelegramForwarder {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.forwardingRules = new Map();
    this.sessionFile = path.join(__dirname, `${config.sessionName}.session`);
    this.retryCount = new Map();
  }

  // Logging utility
  log(level, message, ...args) {
    if (!config.settings.enableLogging) return;
    
    const timestamp = new Date().toISOString();
    const levels = ['error', 'info', 'debug'];
    
    if (levels.indexOf(level) <= levels.indexOf(config.settings.logLevel)) {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
    }
  }

  // Load session from file
  async loadSession() {
    try {
      const sessionData = await fs.readFile(this.sessionFile, 'utf8');
      return new StringSession(sessionData);
    } catch (error) {
      this.log('info', 'No existing session found, creating new session');
      return new StringSession("");
    }
  }

  // Save session to file
  async saveSession() {
    try {
      const sessionString = this.client.session.save();
      await fs.writeFile(this.sessionFile, sessionString);
      this.log('info', 'Session saved successfully');
    } catch (error) {
      this.log('error', 'Failed to save session:', error.message);
    }
  }

  // Initialize Telegram client
  async initializeClient() {
    try {
      this.log('info', 'Initializing Telegram client...');
      
      const session = await this.loadSession();
      
      this.client = new TelegramClient(session, config.apiId, config.apiHash, {
        connectionRetries: 5,
        useTestDC: false, // 使用正式服务器
        baseLogger: console,
      });

      await this.client.start({
        phoneNumber: async () => await input.text("Please enter your phone number: "),
        password: async () => await input.text("Please enter your password: "),
        phoneCode: async () => await input.text("Please enter the code you received: "),
        onError: (err) => {
          this.log('error', 'Authentication error:', err.message);
          throw err;
        },
      });

      await this.saveSession();
      this.isConnected = true;
      this.log('info', 'Successfully connected to Telegram');
      
    } catch (error) {
      this.log('error', 'Failed to initialize client:', error.message);
      throw error;
    }
  }

  // Resolve entity (group/channel) by username or ID
  async resolveEntity(identifier) {
    try {
      // If it's a number, treat as chat ID
      if (typeof identifier === 'number' || /^-?\d+$/.test(identifier)) {
        return parseInt(identifier);
      }
      
      // If it starts with @, resolve username
      if (identifier.startsWith('@')) {
        const entity = await this.client.getEntity(identifier);
        return entity;
      }
      
      // Try to find by title in dialogs
      const dialogs = await this.client.getDialogs({ limit: 100 });
      const found = dialogs.find(dialog => 
        dialog.title?.toLowerCase() === identifier.toLowerCase()
      );
      
      if (found) {
        return found.entity;
      }
      
      throw new Error(`Entity not found: ${identifier}`);
    } catch (error) {
      this.log('error', `Failed to resolve entity ${identifier}:`, error.message);
      throw error;
    }
  }

  // Setup forwarding rules
  async setupForwardingRules() {
    this.log('info', 'Setting up forwarding rules...');
    
    for (const rule of config.forwardingRules) {
      try {
        const sourceEntity = await this.resolveEntity(rule.source);
        const targetEntity = await this.resolveEntity(rule.target);
        
        const ruleKey = `${sourceEntity.id || sourceEntity}`;
        this.forwardingRules.set(ruleKey, {
          ...rule,
          sourceEntity,
          targetEntity,
          sourceId: sourceEntity.id || sourceEntity,
          targetId: targetEntity.id || targetEntity
        });
        
        this.log('info', `Rule added: ${rule.source} -> ${rule.target}`);
      } catch (error) {
        this.log('error', `Failed to setup rule ${rule.source} -> ${rule.target}:`, error.message);
      }
    }
    
    this.log('info', `Successfully setup ${this.forwardingRules.size} forwarding rules`);
  }

  // Check if message should be forwarded based on filters
  shouldForwardMessage(message, rule) {
    if (!message.text && !message.media && !rule.forwardMedia) {
      return false;
    }

    const text = (message.text || '').toLowerCase();
    
    // Check keywords filter
    if (rule.keywords && rule.keywords.length > 0) {
      const hasKeyword = rule.keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }
    
    // Check exclude keywords filter
    if (rule.excludeKeywords && rule.excludeKeywords.length > 0) {
      const hasExcludeKeyword = rule.excludeKeywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
      if (hasExcludeKeyword) return false;
    }
    
    return true;
  }

  // Forward single message with retry logic
  async forwardMessageWithRetry(message, rule, retryCount = 0) {
    try {
      let forwardText = message.text || '';
      
      // Add attribution if enabled
      if (rule.addAttribution) {
        const sourceName = rule.source;
        forwardText = `📢 From: ${sourceName}\n\n${forwardText}`;
      }
      
      if (message.media && rule.forwardMedia) {
        // Forward media with text
        await this.client.sendFile(rule.targetEntity, {
          file: message.media,
          caption: forwardText,
        });
      } else if (forwardText) {
        // Forward text only
        await this.client.sendMessage(rule.targetEntity, forwardText);
      }
      
      this.log('debug', `Message forwarded successfully from ${rule.source} to ${rule.target}`);
      
      // Add delay to prevent rate limiting
      if (rule.forwardDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, rule.forwardDelay));
      }
      
    } catch (error) {
      this.log('error', `Failed to forward message (attempt ${retryCount + 1}):`, error.message);
      
      if (retryCount < config.settings.maxRetries) {
        this.log('info', `Retrying in ${config.settings.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, config.settings.retryDelay));
        await this.forwardMessageWithRetry(message, rule, retryCount + 1);
      } else {
        this.log('error', 'Max retries reached, skipping message');
      }
    }
  }

  // Handle new messages
  async handleNewMessage(event) {
    try {
      const message = event.message;
      const chatId = message.peerId.chatId?.toString() || message.peerId.channelId?.toString() || message.peerId.userId?.toString();
      
      if (!chatId) return;
      
      // Find matching forwarding rule
      const rule = this.forwardingRules.get(chatId);
      if (!rule) return;
      
      // Check if message should be forwarded
      if (!this.shouldForwardMessage(message, rule)) {
        this.log('debug', 'Message filtered out by rules');
        return;
      }
      
      this.log('info', `New message from ${rule.source}, forwarding to ${rule.target}`);
      await this.forwardMessageWithRetry(message, rule);
      
    } catch (error) {
      this.log('error', 'Error handling new message:', error.message);
    }
  }

  // Start message monitoring
  async startForwarding() {
    if (!this.isConnected) {
      throw new Error('Client not connected. Call initializeClient() first.');
    }
    
    this.log('info', 'Starting message forwarding...');
    
    // Setup forwarding rules
    await this.setupForwardingRules();
    
    if (this.forwardingRules.size === 0) {
      throw new Error('No valid forwarding rules configured');
    }
    
    // Add event handler for new messages
    this.client.addEventHandler(
      this.handleNewMessage.bind(this), 
      new NewMessage({ chats: [] }) // Listen to all chats
    );
    
    this.log('info', 'Message forwarding started successfully');
    this.log('info', 'Press Ctrl+C to stop');
    
    // Keep the process running
    process.on('SIGINT', async () => {
      this.log('info', 'Stopping forwarder...');
      await this.stop();
      process.exit(0);
    });
  }

  // Stop forwarding and disconnect
  async stop() {
    try {
      if (this.client && this.isConnected) {
        await this.client.disconnect();
        this.isConnected = false;
        this.log('info', 'Disconnected from Telegram');
      }
    } catch (error) {
      this.log('error', 'Error stopping forwarder:', error.message);
    }
  }

  // Main method to run the forwarder
  async run() {
    try {
      await this.initializeClient();
      await this.startForwarding();
    } catch (error) {
      this.log('error', 'Fatal error:', error.message);
      process.exit(1);
    }
  }
}

// Create and run forwarder if this file is executed directly
if (require.main === module) {
  const forwarder = new TelegramForwarder();
  forwarder.run().catch(error => {
    console.error('Failed to start forwarder:', error);
    process.exit(1);
  });
}

module.exports = TelegramForwarder; 