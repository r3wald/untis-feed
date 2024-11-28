#!/bin/bash

set -e

PM2_NAME=untis-feed

if [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes. Please commit or stash them before deploying."
  exit 1
fi

git pull origin master
git checkout master
npm ci

PM2_PID=$(pm2 pid $PM2_NAME)

if [ -n "$PM2_PID" ]; then
  echo pm2 restart $PM2_NAME
else
  echo pm2 start npm --name $PM2_NAME -- start
fi

