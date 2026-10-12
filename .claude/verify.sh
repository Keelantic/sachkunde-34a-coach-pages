#!/usr/bin/env bash
# Quality gate for the 34a Coach pages. ~/.claude/helpers/verify-before-commit.cjs runs it before
# every `git commit` Claude makes; a failure blocks the commit. By hand: bash .claude/verify.sh
set -euo pipefail
cd "$(dirname "$0")/.."

printf '\n== pages: validate (npm test)\n'
npm test

printf '\nverify.sh: all checks passed\n'
