const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class TestCommand extends BaseCommand {
	constructor() {
		super("reactroles", "utility", []);
	}

	async run(client, message, args) {
		const minecraftRole = message.guild.roles.cache.find((role) => role.name === "Minecraft");
		const leagueOfLegendsRole = message.guild.roles.cache.find(
			(role) => role.name === "League of Legends"
		);

		const minecraftEmoji = "👽";
		const leagueOfLegendsEmoji = "💩";

		let embed = new Discord.MessageEmbed()
			.setColor("#e42643")
			.setTitle("Choose your own roles!")
			.setDescription("Choosing a role will allow you to see the associated channels.");

		let embedMessage = await message.channel.send(embed);
		embedMessage.react(minecraftEmoji);
		embedMessage.react(leagueOfLegendsEmoji);
	}
};
