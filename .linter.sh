#!/bin/bash
cd /home/kavia/workspace/code-generation/browsertodo-94432-4a3cd478/backend_api
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

