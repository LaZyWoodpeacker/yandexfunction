#!/bin/bash
if [ -d "build" ]; then
  rm -R ./build
fi
if [ -d "dist" ]; then
  rm -R ./dist
fi
mkdir build
source .env

echo "npx tsc --build tsconfig.json"
npm run build
cp package.json ./dist/package.json

cd ./dist
if [ -f "../build/func.zip" ]; then
  rm ../build/func.zip
fi
zip -r ../build/func.zip .
cd ..

echo "yc function version create $YDB_FUNCTION_NAME"

yc serverless function version create \
  --function-name=$YDB_FUNCTION_NAME \
  --runtime nodejs18 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 5s \
  --source-path ./build/func.zip \
  --folder-id $YDB_FOLDER_ID \
  --environment YDB_ENDPOINT=$YDB_ENDPOINT,YDB_DATABASE=$YDB_DATABASE,YF_BOT_KEY=$YF_BOT_KEY,YF_BOT_MYNAME=$YF_BOT_MYNAME,YDB_METADATA_CREDENTIALS=1,GITHUB_KEY=$GITHUB_KEY \
  --service-account-id=$YDB_SERVICE_ACCOUNT_ID \

rm -R ./build
rm -R ./dist