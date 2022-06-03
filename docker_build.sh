#!/usr/bin/env bash

branch=$(git symbolic-ref -q HEAD)
branch=${branch##refs/heads/}
branch=${branch:-HEAD}
version=$1

echo "Using branch ${branch}"
echo "Building image..."
docker build -t messenger-server:${version:-$branch} .