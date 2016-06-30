var SlackBot = require('slackbots');

var supportbot = new SlackBot({
    token: process.env.BOT_TOKEN,
    name: 'supportbot'
});

console.log(supportbot.name)

supportbot.on('start', function() {
    
    console.log("bot started")

    var params = {
        icon_emoji: ':bug:'
    };

    // supportbot.postMessageToUser('mjkaufer', 'you are the coolest', params);

    var analyse = require('../processing/analyse.js') //pierce insisted on spelling it the british way

    var db = require('./db.js')(function(dbFunctions){
        
        console.log(dbFunctions)

        startSupportBotListening(dbFunctions)


    })

    function startSupportBotListening(dbFunctions){

            var messageCollection = dbFunctions.getMessageCollection()
            var addToCollection = dbFunctions.addMessageToCollection

            console.log("Support bot listening")

            supportbot.on('message', function(data){

                if(data.type != "message" || (data.username && data.username == supportbot.name))//if the user is just typing or something
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

                    addToCollection({ // add message received from user
                        userId: data.user,
                        message: data.text,
                        timeStamp: data.ts,
                        isSupportBot: false,
                        to: null//null val means it's being sent to the bot
                    }, function(e,r){
                        console.log(e,r)
                    })

                    var response = analyse.chat(data)
                    // console.log("RES",response)

                    supportbot.postMessageToUser(userData.name, response, params, function(r,e){
                        // console.log("POST_MESSAGE",e,r)


                        if(!e && r && r.ok){

                            addToCollection({
                                userId: r.message.bot_id,
                                message: r.message.text,
                                timeStamp: r.ts,
                                isSupportBot: true,
                                to: data.userhi
                            }, function(e,r){
                                console.log(e,r)
                            })
                        }
                        else{
                            console.log("Something happened",e,r,!e,!!r,r.ok==true)
                        }
                        // console.log("Sent message")
                    });
                })

            
        })
    }
});