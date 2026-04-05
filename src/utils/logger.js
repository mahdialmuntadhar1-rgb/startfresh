const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logger with timestamps and job tracking
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `qahbaxana-${new Date().toISOString().split('T')[0]}.log`);
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const jobId = meta.jobId ? `[Job:${meta.jobId}]` : '';
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    
    return `[${timestamp}] ${level} ${jobId} ${message}${metaStr}`;
  }

  writeToFile(formattedMessage) {
    try {
      fs.appendFileSync(this.logFile, formattedMessage + '\n');
    } catch (error) {
      // Ignore file write errors to avoid breaking the app
    }
  }

  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('INFO', message, meta);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('WARN', message, meta);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  error(message, meta = {}) {
    const formattedMessage = this.formatMessage('ERROR', message, meta);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      const formattedMessage = this.formatMessage('DEBUG', message, meta);
      console.log(formattedMessage);
      this.writeToFile(formattedMessage);
    }
  }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;
