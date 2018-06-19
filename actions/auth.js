const session = require('../storage/session.json');

module.exports = {
  getAuthKeys() {
    return session;
  }
}