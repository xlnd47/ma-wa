import BaseEvent from "../../utils/structures/BaseEvent";
import { Message } from "discord.js";
import DiscordClient from "../../client/client";
import { Guild, GuildModel } from "../../utils/models/guild.model";

export default class MessageEvent extends BaseEvent {
	constructor() {
		super("message");
	}

	async run(client: DiscordClient, message: Message) {
		if (message.author.bot) return;
		if (!message.guild) return; //skip private messages for now

		let guild = await GuildModel.findOne({ guildId: message.guild.id }).exec();

		if (!guild) {
			let registerGuild = new Guild();
			registerGuild.guildId = message.guild.id;
			registerGuild.prefix = process.env.DISCORD_BOT_PREFIX ?? "?";
			guild = await GuildModel.create(registerGuild);
		}

		if (message.content.startsWith(guild.prefix)) {
			const [cmdName, ...cmdArgs] = message.content
				.slice(guild.prefix.length)
				.trim()
				.split(/\s+/);
			const command = client.commands.get(cmdName);
			if (command) {
				command.run(client, message, cmdArgs);
			}
		}
	}
}
