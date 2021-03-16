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

		client.on("messageReactionAdd", async (reaction, user) => {
			try {
				if (user.bot) return;
				if (reaction.message.partial) await reaction.message.fetch();
				if (reaction.partial) await reaction.fetch();
				if (!reaction.message.guild) return;
				if (reaction.message.channel.id == process.env.GET_ROLES_CHANNEL_ID) {
					if (reaction.emoji.name === minecraftEmoji) {
						return await reaction.message.guild.members.cache
							.get(user.id)
							.roles.add(minecraftRole);
					} else if (reaction.emoji.name === leagueOfLegendsEmoji) {
						return await reaction.message.guild.members.cache
							.get(user.id)
							.roles.add(leagueOfLegendsRole);
					}
				}
			} catch {
				return;
			}
		});

		client.on("messageReactionRemove", async (reaction, user) => {
			try {
				if (user.bot) return;
				if (reaction.message.partial) await reaction.message.fetch();
				if (reaction.partial) await reaction.fetch();
				if (!reaction.message.guild) return;
				if (reaction.message.channel.id == process.env.GET_ROLES_CHANNEL_ID) {
					if (reaction.emoji.name === minecraftEmoji) {
						return await reaction.message.guild.members.cache
							.get(user.id)
							.roles.remove(minecraftRole);
					} else if (reaction.emoji.name === leagueOfLegendsEmoji) {
						return await reaction.message.guild.members.cache
							.get(user.id)
							.roles.remove(leagueOfLegendsRole);
					}
				}
			} catch {
				return;
			}
		});
	}
};
