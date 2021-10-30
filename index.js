const express = require('express');
const app = express();
const rp = require('request-promise');
const {ApiClient} = require('twitch');
const {StaticAuthProvider} = require('twitch-auth');
const {ChatClient} = require('twitch-chat-client');
const config = require('./config.json');
const twitchBot = require('twitch-bot');
const Sequelize = require('sequelize');
const path = require('path');
const DadJoke = require('./dadjoke');
const Chatter = require('./chatter');
const CommandHandler = require('./command_handler');
const CommandParser = require('./command_parser');
const Responder = require('./responder');
const Adder = require('./adder');
const Rekt = require('./rekt');
const EightBall = require('./eightball');
const {db, getAllChannels, Channel} = require('./db');

console.log(config)
app.listen(process.env.PORT, () => {
	console.log('Pun_IO is live');
});

const authProvider = new StaticAuthProvider(config.client_id, config.access_token);
const client = new ApiClient({authProvider});

/*const handler = new CommandHandler();
handler.add('rekt', chatter => {
	const rekt = new Rekt();
	chatter.say(rekt.getRekt();
});
hander.add('add', (chatter, cmd, args) => {
	const adder = new Adder();
	const math = adder.add(args);
	if (math.type == 'success') chatter.say(math.result);
	else if (math.type == 'error') chatter.say(`"${math.result}" isn't a number`);
});
handler.add('doesshawnloveme', chatter => {
	chatter.say('No');
});
handler.add('unio', chatter => {
	chatter.say('Pun_IO is a Twitch bot by shawntc. For feedback you can whisper shawntc on Twitch or contact him on Twitter @shawntco.');
});*/

const responder = new Responder();
responder.add('hi pun_io', (chatter, username) => {
	chatter.say(`Hello ${username}!`);
});
responder.add('hello pun_io', (chatter, username) => {
	chatter.say(`Hello ${username}!`);
});


getAllChannels().then(channels => {
	console.log(channels.map(c => c.name))
	const bot = new twitchBot({
		username: 'pun_io',
		oauth: config.bot_oauth,
		channels: channels.filter(c => c.autojoin == 1).map(c => c.name)
	});
	bot.on('join', channel => console.log('Joined', channel));
	bot.on('message', received => {
		const {username, message, channel} = received;
		const chatter = new Chatter(bot, channel);
		responder.chatter = chatter;
		console.log(`[${channel}] ${username}: ${message}`);
		responder.run(message, username);
		const parser = new CommandParser(message);
		switch (parser.command) {
		    case '!prekt':
			const rekt = new Rekt();
			chatter.say(rekt.getRekt());
			break;
		    case '!padd':
			const adder = new Adder();
			const math = adder.add(parser.arguments);
			if (math.type == 'success') {
			    chatter.say(math.result);
			} else if (math.type == 'error') {
			    chatter.say(`"${math.result}" isn't a number`);
			}
			break;
		    case '!doesshawnloveme':
			chatter.say('No');
			break;
		    case '!punio':
			chatter.say('Pun_IO is a Twitch bot by shawntc. For feedback you can whisper shawntc on Twitch or contact him on Twitter @shawntco');
			break;
		    case '!pun':
			const joker = new DadJoke(bot, channel);
			joker.tellJoke();
			break;
		    case '!punworld':
			chatter.say('hello world!');
			break;
		    case '!pwinpls':
			chatter.say(`${parser.arguments[0]} win pls`);
		    case '!attitude':
			chatter.say('Not with that attitude!');
		    case '!punball':
			const ball = new EightBall();
			const answer = ball.shake();
			chatter.say(answer);
		    default:
			break;
		}
	});
});
