class CommandParser {
    constructor(command) {
        const [first, parts] = this.split(command);
        this.command = first;
        this.arguments = parts;
    }

    split(command) {
        const parts = command.split(' ');
        const first = parts.shift();
        return [first, parts];
    }
}

module.exports = CommandParser;