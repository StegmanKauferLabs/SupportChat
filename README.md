# SupportChat

## Setup

To run the slackbot server, set an environment variable `BOT_TOKEN` with your slack bot's token. You can add bots to slack [here](https://stegmankauferlabs.slack.com/apps/A0F7YS25R-bots)

Set `MONGO_URL` as your mongodb's location. Set `MONGO_USER` and `MONGO_PASS` env vars as your username and password for your mongodb server.

## Slackbot

To start the slackbot from the root directory, cd to `slackbot`, run `npm install`, and run `node index.js`. 