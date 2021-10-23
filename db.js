const {Sequelize, DataTypes} = require('sequelize');

// Connection itself
const db = new Sequelize({ dialect: 'sqlite', storage: './punio.db' });

// Channels table
const Channel = db.define('channel', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	name: DataTypes.STRING(25),
	autojoin: DataTypes.INTEGER,
	silent: DataTypes.INTEGER
}, {
	freezeTableName: true,
	timestamps: false
});

function getAllChannels() {
	return Channel.findAll();
}

module.exports = {db, Channel, getAllChannels};
