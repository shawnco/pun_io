class Responder {
	constructor() {
		this.phrases = {};
		this.chatter = null;
	}

	add(phrase, handler) {
		this.phrases[phrase] = handler;
	}

	run(msg, username) {
		const phrase = msg.toLowerCase().trim();
		if (this.phrases[phrase]) {
			this.phrases[phrase](this.chatter, username);
		}
	}
}

module.exports = Responder;
