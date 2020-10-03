//@ts-check

class Events {
  /**
   * @param {number} accountId
   * @param {number} timestamp
   * @param {string} data
   */
  constructor(accountId, timestamp, data) {
    this.accountId = accountId;
    this.timestamp = timestamp;
    this.data = data;
  }
}

module.exports = Events;
