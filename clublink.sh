#!/bin/bash
if [ -d "./node_modules" ]
then
    ts-node ./src/index.ts --gui --chat
else
    npm i
    npm i -g typescript
fi