const fs = require('fs');
const path = require('path');
const glob = require('glob');
const stripAnsi = require('strip-ansi');
const { output } = require('@nrwl/workspace');
const createCheck = require('create-check').default;

const { APP_ID, PRIVATE_KEY } = require('./constants');

const reportFiles = glob.sync(path.join(__dirname, './*.report.json'));
/** @type {import('@jest/reporters').AggregatedResult[]} */
const reports = reportFiles.map((reportFile) => require(reportFile));

/**
 * @param {import('@jest/reporters').TestResult[]} results
 * @returns {import('create-check').Annotation[]}
 */
function createAnnotations(results) {
  /** @type {import('create-check').Annotation[]} */
  const annotations = [];

  for (const result of results) {
    const { testFilePath, testResults } = result;

    for (const failure of testResults) {
      if ('location' in failure) {
        const { location, failureMessages } = failure;

        if (location) {
          failureMessages.forEach((message) => {
            const numbers = message.match(
              new RegExp(`${result.testFilePath}:(\\d+):\\d+`)
            );
            const start_line = numbers
              ? Number(numbers[1])
              : location.line || 0;

            annotations.push({
              path: path.relative(process.cwd(), testFilePath),
              start_line,
              end_line: start_line,
              annotation_level: 'failure',
              message: failureMessages.map(stripAnsi).join('\n'),
            });
          });
        }
      }
    }
  }

  return annotations;
}

async function reportToGitHub() {
  const annotations = [];
  let numFailedTests = 0;

  for (const report of reports) {
    numFailedTests += report.numFailedTests;
    annotations.push(...createAnnotations(report.testResults));
  }

  await createCheck({
    tool: 'Jest',
    name: 'Test',
    annotations,
    errorCount: numFailedTests,
    appId: process.env.JEST_APP_ID ? Number(process.env.JEST_APP_ID) : APP_ID,
    privateKey: process.env.JEST_PRIVATE_KEY || PRIVATE_KEY,
  });
}

reportToGitHub()
  .then(() =>
    output.log({
      title: 'Reports have been published to GitHub successfully.',
    })
  )
  .catch((error) =>
    output.error({
      title: 'Reports have been failed to publish to GitHub: ' + error.message,
    })
  )
  .finally(() =>
    reportFiles.forEach((reportFile) => fs.unlinkSync(reportFile))
  );
