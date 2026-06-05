const constants = require('./constants');
const mockData = require('./mock-data');
const env = require('./env');

module.exports = {
  ...constants,
  ...mockData,
  ...env
};
