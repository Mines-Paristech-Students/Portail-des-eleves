#!/bin/bash
# Script will fail if the branch cannot merge in the staging branch
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euxo pipefail
IFS=$'\n\t'

git fetch --quiet --no-tags origin master
git fetch --no-tags --force origin staging:staging
git diff
git checkout staging
git config --global user.email "gitlag@mines-paris.eu"
git config --global user.name "GITLAB CI"
env EDITOR=cat git merge --no-ff "$CI_COMMIT_SHA"

