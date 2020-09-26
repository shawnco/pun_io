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

const db = new Sequelize('punio', 'pun_io', 'password', {
	dialect: 'sqlite',
	storage: path.join(__dirname) + '/punio.db'
});


console.log(config)
app.listen(process.env.PORT, () => {
	console.log('Pun_IO is live');
});

const authProvider = new StaticAuthProvider(config.client_id, config.access_token);
const client = new ApiClient({authProvider});

const channels = config.channels;
const bot = new twitchBot({
	username: 'pun_io',
	oauth: config.bot_oauth,
	channels
});
bot.on('join', channel => console.log('Joined', channel));
bot.on('message', chatter => {
	const {username, message, channel} = chatter;
	// console.log(`[${channel}] ${username}: ${message}`);
	if (message.toLowerCase() == 'hi pun_io') {
		bot.say(`Hello ${username}!`, channel);
	} else {
		const parts = message.split(' ');
		const command = parts[0];
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
			rp(punOptions).then(res => {
				const {joke} = JSON.parse(res);
				bot.say(joke, channel);
			});
		
		}
		if (command == '!punmark') {
			console.log('channel is',channel)
			const channelFixed = channel.replace('#', '');
			client.helix.users.getUserByName(channelFixed).then(user => {
				const id = user.id;
				console.log('id is', id);
				client.helix.streams.getStreamByUserId(user.id).then(stream => {
					//console.log(stream.);
					const {started_at} = stream._data;
					const now = (new Date()).getTime();
					const started = (new Date(started_at)).getTime();
					const len = (now - started) / 1000;
					const seconds = Math.round(len);
					client.helix.videos.getVideosByUser(id).then(videos => {
						const link = `${videos.data[0]._data.url}?t=${seconds}s`;
						console.log(link, channel);
						db.query('INSERT INTO marks (link, channel) VALUES (:link, :channel)', {
							QueryType: db.QueryTypes.INSERT,
							replacements: { link, channel },
							logging: console.log
						})
						.then(result => console.log(result[1].lastID))
						.catch(err => console.log('Oof', err));
					});
				});
			});
		}
		if (command == '!punmarkget') {
			const id = parts[1];
			db.query('SELECT * FROM marks WHERE id = :id', {
				QueryType: db.QueryTypes.SELECT,
				replacements: { id },
				logging: console.log
			})//.then(result => console.log(result[0][0].link))
			.then(result => {
				if (result[0][0]) {
					//const {link, channel} = result[0][0];
					const link = result[0][0].link;
					const vidChannel = result[0][0].channel;
					bot.say(`(${vidChannel}): ${link}`, channel);	
				} else {
					console.log('Not found');
					bot.say('Not found', channel);
				}
			})
			.catch(err => console.log('Ouch', err));
		}
	}
});
