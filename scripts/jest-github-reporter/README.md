# jest-github-reporter

This plugin is basically a copy of https://github.com/hipstersmoothie/jest-github-reporter.

We have faced the issue that it's configured per project. And we have, say, 50 projects, then it runs 50 times. And the first one to pass is the one that sets the status in GitHub.

The `index.js` contains a `FileReporter` class that basically outputs results to `.json` file except `.xml` (as Jest does by default within the `reports` folder).

We could've used `nx test [project] --json --outputFile=scripts/jest-github-reporter/report.json` option, but the issue is Jest doesn't redirect the stderr stream to the output file, which doesn't allow us to know about the projects that failed to test.

When all reports are collected into `*.report.json` files, Jenkins will run `report-to-github` script, which will loop reports, collect the number of failed tests and annotations and push them to GitHub.

Note that there's a `package.json` file within the folder. This is because the folder is installed as a local dependency `"jest-github-reporter": "file:./scripts/jest-github-reporter"`, so we don't have to change all `jest.config.js` accordingly.
