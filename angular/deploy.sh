#!/bin/bash

if [ -z "$1" ]; then
    MODE="staging"
else
    MODE=$1
fi

if [ $MODE = "production" ]; then
    BASE_HREF="/map/"
elif [ $MODE = "staging" ]; then
    BASE_HREF="/map2/"
else
    echo "Illegal argument"
    exit -1
fi

# Setting MSYS2_ARG_CONV_EXCL is necessary for Git Bash (on Windows).
# See https://stackoverflow.com/questions/50662064/
MSYS2_ARG_CONV_EXCL="--base-href" npm run build -- --base-href=$BASE_HREF

# The .json files are only needed for development.
rm dist/assets/*.json

DEPLOY_DIR="/var/www/berlin-vegan-wp"$BASE_HREF
rsync -avz dist/ deploy@berlin-vegan.de:$DEPLOY_DIR
# On Windows, you may use this instead of rsync (rm -rf * in $DEPLOY_DIR on server before):
# scp -r dist/* deploy@berlin-vegan.de:$DEPLOY_DIR