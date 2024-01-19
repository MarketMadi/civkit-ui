const crypto = require('crypto-browserify');

module.exports = {
  resolve: {
    fallback: {
      "crypto": "crypto-browserify",
    },
  },
};
