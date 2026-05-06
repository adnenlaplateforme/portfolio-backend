#!/bin/sh
set -e
node dist/config/migrate.js
node dist/config/seed.js
node dist/server.js
