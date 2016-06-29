var SlackBot = require('slackbots');

var supportbot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: 'supportbot'
});

supportbot.on('start', function() {
    
    console.log("bot started")

    var params = {
        icon_emoji: ':bug:'
    };

    supportbot.postMessageToUser('mjkaufer', 'hello world', params);
});