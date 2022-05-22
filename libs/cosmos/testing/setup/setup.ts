/// <reference types="node" />

if (typeof process.env.JEST_WORKER_ID === 'undefined') {
  // Prevent the module being imported in any application file.
  throw new Error('This module should be used only within tests.');
}

import './setup-jest';
import './setup-di';
