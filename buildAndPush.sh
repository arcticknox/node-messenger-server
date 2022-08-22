#!/usr/bin/env bash

branch=$(git symbolic-ref -q HEAD)
branch=${branch##refs/heads/}
branch=${branch:-HEAD}
version=$1
image=838494801100.dkr.ecr.ap-south-1.amazonaws.com/messenger-server

echo "Using branch ${branch}"
echo "Building image..."
docker build -t messenger-server:${version:-$branch} .
echo "Logging into ECR..."
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 838494801100.dkr.ecr.ap-south-1.amazonaws.com
docker tag messenger-server:${version:-$branch} ${image}:${version:-$branch}
docker push ${image}:${version:-$branch}