const Discord = require("discord.js");
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class TestCommand extends BaseCommand {
	constructor() {
		super("reactroles", "utility", []);
	}

	async run(client, message, args) {
		const getRolesChannelId = "821108367338504213";
		const minecraftRole = message.guild.roles.cache.find(
			(role) => role.name === "Minecraft"
		);
		const leagueOfLegendsRole = message.guild.roles.cache.find(
			(role) => role.name === "League of Legends"
		);

		const minecraftEmoji = "👽";
		const leagueOfLegendsEmoji = "💩";

		let embed = new Discord.MessageEmbed()
			.setColor("#e42643")
			.setTitle("Choose your own roles!")
			.setDescription(
				"Choosing a role will allow you to see the associated channels."
			);

		let embedMessage = await message.channel.send(embed);
		embedMessage.react(minecraftEmoji);
		embedMessage.react(leagueOfLegendsEmoji);

		client.on("messageReactionAdd", async (reaction, user) => {
			if (reaction.message.partial) await reaction.message.fetch();
			if (reaction.partial) await reaction.fetch();
			if (user.bot) return;
			if (!reaction.message.guild) return;
			if (reaction.message.channel.id == getRolesChannelId) {
				if (reaction.emoji.name === minecraftEmoji) {
					await reaction.message.guild.members.cache
						.get(user.id)
						.roles.add(minecraftRole);
				} else if (reaction.emoji.name === leagueOfLegendsEmoji) {
					await reaction.message.guild.members.cache
						.get(user.id)
						.roles.add(leagueOfLegendsRole);
				}
			} else {
				return;
			}
		});

		client.on("messageReactionRemove", async (reaction, user) => {
			if (reaction.message.partial) await reaction.message.fetch();
			if (reaction.partial) await reaction.fetch();
			if (user.bot) return;
			if (!reaction.message.guild) return;
			if (reaction.message.channel.id == getRolesChannelId) {
				if (reaction.emoji.name === minecraftEmoji) {
					await reaction.message.guild.members.cache
						.get(user.id)
						.roles.remove(minecraftRole);
				} else if (reaction.emoji.name === leagueOfLegendsEmoji) {
					await reaction.message.guild.members.cache
						.get(user.id)
						.roles.remove(leagueOfLegendsRole);
				}
			} else {
				return;
			}
		});
	}
};
