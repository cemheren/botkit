var Botkit = require(__dirname + '/CoreBot.js');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var botBuilder = require('botbuilder');

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

            bot.send = function(message, cb){
                
                var connector = new botBuilder.ConsoleConnector().listen();
                var bot = new botBuilder.UniversalBot(connector);

                bot.dialog("/", [
                    function(session, results){
                        session.send(message.text);
                    }
                ]);

            }
    });
}

module.exports = BotframeworkBot;