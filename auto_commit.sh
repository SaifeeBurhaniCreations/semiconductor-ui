#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./auto_commit.sh \"commit message\""
  exit 1
fi

MESSAGE="$*"

git add .
git commit -m "auto: $MESSAGE"
git pull