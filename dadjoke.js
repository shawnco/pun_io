const axios = require('axios');

class DadJoke {
  constructor(bot, channel) {
    this.bot = bot;
    this.channel = channel;
    this.apiUrl = 'https://icanhazdadjoke.com/';
  }

  async tellJoke() {
    try {
      const response = await axios.get(this.apiUrl, {
        headers: {
          Accept: 'application/json'
        }
      });
      console.log('### response', response.data.joke, this.channel);
      const joke = response.data.joke;
      this.bot.say(this.channel, joke);
    } catch (error) {
      console.error('Error fetching dad joke:', error);
    }
  }
}

module.exports = DadJoke;
