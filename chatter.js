class Chatter {
  constructor(bot, channel) {
    this.bot = bot;
    this.channel = channel;
  }

  say(message) {
    try {
      this.bot.say(this.channel, message);
    } catch (e) {
      console.log('Exception', e);
    }
  }
}

module.exports = Chatter;
