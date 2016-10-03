var Botkit = require(__dirname + '/CoreBot.js');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var botBuilder = require('botbuilder');
var restify = require('restify');

function BotframeworkBot(configuration) {
    
    var botframework_botkit = Botkit(configuration || {});

    botframework_botkit.defineBot(function(botkit, config) {

            var bot = {
                botkit: botkit,
                config: config || {},
                utterances: botkit.utterances,
            };

            bot.startConversation = function(message, cb) {
                botkit.startConversation(this, message, cb);
            };

            bot.botkit.send = function(message, cb){
                botframework_botkit.universalBot.send(message);
            }
            
            bot.botkit.send = function(message, text, cb){
                message.text = text;
                botframework_botkit.universalBot.send(message);
            }

            bot.botkit.on('message_received', function(b, m) {
                if (b.identity && m.from == b.identity) {
                    return false;
                }

                if (!m.text) {
                    // message without text is probably an edit
                    return false;
                }

                if (b.identity) {
                    var channels = b.channels.channels;

                    // if its not in a channel with the bot
                    var apprChan = channels.filter(function(ch) {
                        return ch.sid == message.channel;
                    });

                    if (apprChan.length === 0) {
                        return false;
                    }
                }
            });

            bot.botkit.universalBot.dialog('/', function (session) {
                bot.botkit.trigger('message_received', [bot.botkit, session.message]);
            });

            return bot;
    });

    botframework_botkit.setupWebserver = function(port, cb) {

        if (!port) {
            throw new Error('Cannot start webserver without a port');
        }
        if (isNaN(port)) {
            throw new Error('Specified port is not a valid number');
        }

        botframework_botkit.server = restify.createServer();
        botframework_botkit.server.listen(process.env.port || process.env.PORT || 3978, function () {
            console.log('%s listening to %s', botframework_botkit.server.name, botframework_botkit.server.url); 
        });

        // Create chat bot
        var connector = new botBuilder.ChatConnector({
            appId: configuration.appId, //process.env.MICROSOFT_APP_ID,
            appPassword: configuration.appPassword //process.env.MICROSOFT_APP_PASSWORD
        });
        var bot = new botBuilder.UniversalBot(connector);
        botframework_botkit.server.post('/api/messages', connector.listen());
        botframework_botkit.universalBot = bot;
        botframework_botkit.connector = connector;

       return botframework_botkit;
    };

    return botframework_botkit;
}

module.exports = BotframeworkBot;