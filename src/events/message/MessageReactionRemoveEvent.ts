// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionRemove
import { MessageReaction, User } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";

export default class MessageReactionRemoveEvent extends BaseEvent {
	constructor() {
		super("messageReactionRemove");
	}

	async run(client: DiscordClient, reaction: MessageReaction, user: User) {}
}
