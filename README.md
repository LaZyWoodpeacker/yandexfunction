.env

```
YDB_FOLDER_ID=
YDB_FUNCTION_NAME=
YDB_SERVICE_ACCOUNT_ID=
YDB_ENDPOINT=
YDB_DATABASE=
YDB_SERVICE_ACCOUNT_KEY_FILE_CREDENTIALS=
YDB_METADATA_CREDENTIALS=0

YF_BOT_KEY=
YF_BOT_MYNAME=

GITHUB_KEY=
GITHUB_USERNAME=

```

create access file

```
yc iam key create --service-account-name <service account name> -o authorized_key.json
```

reg telegram webhook

```
curl -XPOST -F "url=<url>" -F "drop_pending_updates=true" "https://api.telegram.org/bot<token>/setWebhook"
```
