//@ts-check

class Account {
  /**
   * @param {number} accountId
   * @param {string} accountName
   * @param {boolean} isActive
   */
  constructor(accountId, accountName, isActive) {
    this.accountId = accountId;
    this.accountName = accountName;
    this.isActive = isActive;
  }
}

module.exports = Account;
