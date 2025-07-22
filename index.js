const express = require('express');
const app = express();
const tmi = require('tmi.js');
const config = require('./config.json');
const DadJoke = require('./dadjoke');
const Chatter = require('./chatter');
const CommandParser = require('./command_parser');
const Responder = require('./responder');
const Rekt = require('./rekt');
const EightBall = require('./eightball');

app.listen(process.env.PORT, () => {
	console.log('Pun_IO is live');
});

const responder = new Responder();
responder.add('hi pun_io', (chatter, username) => {
	chatter.say(`Hello ${username}!`);
});
responder.add('hello pun_io', (chatter, username) => {
	chatter.say(`Hello ${username}!`);
});

const start = async () => {
	const client = new tmi.Client({
		options: { debug: true },
		identity: {
			username: 'pun_io',
			password: config.bot_oauth,
		},
		channels: config.channels,
	});
	await client.connect();
	client.on('message', (channel, tags, message, self) => {
		if (self) return;
		const {username} = tags;
		const chatter = new Chatter(client, channel);
		// Let me "talk through" pun_io
		if (channel === '#pun_io' && username === 'shawntc') {
			const [targetChannel, ...rest] = message.split(' ');
			if (targetChannel.indexOf('#') === 0) {
				client.say(targetChannel, rest.join(' '));
			}
		}
		// Various commands
		responder.chatter = chatter;
		console.log(`[${channel}] ${username}: ${message}`);
		responder.run(message, username);
		const parser = new CommandParser(message);
		switch (parser.command) {
			case '!prekt':
				const rekt = new Rekt();
				chatter.say(rekt.getRekt());
				break;
			case '!doesshawnloveme':
				chatter.say('No');
				break;
			case '!punio':
				chatter.say('Pun_IO is a Twitch bot by shawntc. For feedback you can whisper shawntc on Twitch or contact him on Twitter @shawntco');
				break;
			case '!pun':
				console.log('### got to here');
				const joker = new DadJoke(client, channel);
				joker.tellJoke();
				break;
			case '!pwinpls':
				chatter.say(`${parser.arguments[0]} win pls`);
				break;
			case '!attitude':
				chatter.say('Not with that attitude!');
				break;
			case '!punball':
				const ball = new EightBall();
				const answer = ball.shake();
				chatter.say(answer);
				break;
			default:
				break;
		}
	});
}

start();
