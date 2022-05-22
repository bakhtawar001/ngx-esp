#!/bin/bash

echo "Installing npm dependencies..."
cd ./tests/visual
npm install --no-audit --no-optional

echo "Running visual regression tests..."
npm run test