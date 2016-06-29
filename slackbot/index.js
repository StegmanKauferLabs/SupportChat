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

    // supportbot.postMessageToUser('mjkaufer', 'you are the coolest', params);

    var analyse = require('../processing/analyse.js') //pierce insisted on spelling it the british way



    supportbot.on('message', function(data){

        if(data.type != "message")//if the user is just typing or something
            return

        //`data` in the format of
        /*
            type
            channel
            user
            text
            ts
            team
        */

        supportbot.getUserById(data.user).then(function(userData){
            var response = analyse.chat(data)
            supportbot.postMessageToUser(userData.name, response, params);
        })

        
    })
});