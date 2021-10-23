const rp = require('request-promise');

class DadJoke { 
    constructor(bot, channel) {
        this.bot = bot;
        this.channel = channel;
        this.options = {
            method: 'GET',
            uri: 'https://icanhazdadjoke.com',
            headers: {
                Accept: 'application/json'
            }
        };
    }

    tellJoke() {
        return rp(this.options).then(res => {
            const { joke } = JSON.parse(res);
            this.bot.say(joke, this.channel);
        });
    }
}

module.exports = DadJoke;
