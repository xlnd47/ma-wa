import { MessageReaction, User } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";

export default class MessageReactionRemoveEvent extends BaseEvent {
	constructor() {
		super("messageReactionRemove");
	}

	async run(client: DiscordClient, reaction: MessageReaction, user: User) {
		// try {
		// 	if (user.bot) return;
		// 	if (reaction.message.partial) await reaction.message.fetch();
		// 	if (reaction.partial) await reaction.fetch();
		// 	if (!reaction.message.guild) return;
		// 	if (reaction.message.channel.id == process.env.GET_ROLES_CHANNEL_ID) {
		// 		if (reaction.emoji.name === minecraftEmoji) {
		// 			return await reaction.message.guild.members.cache
		// 				.get(user.id)
		// 				.roles.remove(minecraftRole);
		// 		} else if (reaction.emoji.name === leagueOfLegendsEmoji) {
		// 			return await reaction.message.guild.members.cache
		// 				.get(user.id)
		// 				.roles.remove(leagueOfLegendsRole);
		// 		}
		// 	}
		// } catch {
		// 	return;
		// }
	}
}
