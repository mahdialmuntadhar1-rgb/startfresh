const logger = require('./logger');

async function sleep(ms) {
  if (ms <= 0) return;
  
  logger.debug(`Sleeping for ${ms}ms`);
  
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  sleep
};
