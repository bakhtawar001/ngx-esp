const fs = require('fs');
const path = require('path');

class FileReporter {
  /**
   * @param {Set<import('@jest/reporters').Test['context']>} contexts
   * @param {import('@jest/reporters').AggregatedResult} testResult
   */
  onRunComplete(contexts, testResult) {
    if (process.env.CI !== 'true') {
      return;
    }

    const [context] = Array.from(contexts);

    fs.writeFileSync(
      path.join(__dirname, `./${context.config.name}.report.json`),
      JSON.stringify(testResult)
    );
  }
}

module.exports = FileReporter;
