class CommandHandler {
	constructor(prefix = '!p') {
		this.commands = {};
		this.prefix = prefix;
	}

	add(cmd, handler) {
		this.commands[this.prefix + cmd] = handler;
	}

	getArgs(cmd) {
		const parts = cmd.split(' ');
		const command = parts.shift();
		const args = parts;
		return [commands, args];
	}

	run(chatter, msg) {
		const [cmd, args] = this.getArgs(msg);
		if (this.commands[cmd]) {
			this.commands[cmd](chatter, cmd, args);
		}
	}
}

module.exports = CommandHandler;
