const express = require('express');
const app = express();
const rp = require('request-promise');
const {ApiClient} = require('twitch');
const {StaticAuthProvider} = require('twitch-auth');
const {ChatClient} = require('twitch-chat-client');
const config = require('./config.json');
const twitchBot = require('twitch-bot');
console.log(config)
app.listen(process.env.PORT, () => {
	console.log('Pun_IO is live');
});

const authProvider = new StaticAuthProvider(config.client_id, config.access_token);
const client = new ApiClient({authProvider});
const videos = client.helix.videos.getVideosByUser('24437603');
videos.then(vids => {
	//console.log('vids gotten');
	//console.log(vids.data[0]._data);
});

const channels = ['shawntc'];
const bot = new twitchBot({
	username: 'pun_io',
	oauth: config.bot_oauth,
	channels
});
bot.on('join', channel => console.log('Joined', channel));
bot.on('message', chatter => {
	const {username, message, channel} = chatter;
	console.log(`[${channel}] ${username}: ${message}`);
	if (message.toLowerCase() == 'hi pun_io') {
		bot.say(`Hello ${username}!`, channel);
	} else {
		const command = message.split(' ')[0];
		if (command == '!punio') {
			bot.say('Pun_IO is a Twitch bot by shawntc. For feedback you can whisper shawntc on Twitch or contact him on Twitter @shawntco', channel);
		}
		if (command == '!pun') {
			const punOptions = {
				method: 'GET',
				uri: 'https://icanhazdadjoke.com',
				headers: {
					Accept: 'application/json'
				}
			};
			//rp(punOptions).then(res => bot.say(res.joke, channel));
			rp(punOptions).then(res => {
				const {joke} = JSON.parse(res);
				bot.say(joke, channel);
			});
		
		}
	}
});
