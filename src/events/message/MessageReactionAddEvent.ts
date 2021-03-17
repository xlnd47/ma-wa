// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd
import { MessageReaction, User } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
import DiscordClient from "../../client/client";

export default class MessageReactionAddEvent extends BaseEvent {
	constructor() {
		super("messageReactionAdd");
	}

	async run(client: DiscordClient, reaction: MessageReaction, user: User) {}
}
