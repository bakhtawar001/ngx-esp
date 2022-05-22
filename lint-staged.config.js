const validateJestConfigs = require('./scripts/validate-jest-configs');

module.exports = {
  '{apps,libs,tools}/**/*.{ts,json,md,scss,html}': (files) => [
    'npm run format:write -- --uncommitted',
    `git add ${files.join(' ')}`,
  ],
  '{apps,libs}/**/jest.config.js': (files) => validateJestConfigs(files),
};
