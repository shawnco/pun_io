class Chatter {
    constructor(bot, channel) {
        this.bot = bot;
        this.channel = channel;
    }

    say(message) {
	try {
        	this.bot.say(message, this.channel);
	} catch (e) {
		console.log('Exception', e);
	}
    }
}

module.exports = Chatter;
