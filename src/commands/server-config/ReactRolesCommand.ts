import { Message } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";

export default class ReactRolesCommand extends BaseCommand {
	private readonly timeoutDuration: number;

	constructor() {
		super("reactroles", "server-config", []);
		this.timeoutDuration = 3333;
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args.length > 0) {
			switch (args[0].toLowerCase()) {
				case "create":
					createNewReactRolesMessage();
					break;
				default:
					message
						.reply(`"${args[0]}" isn't a valid argument.`)
						.then((message) => message.delete({ timeout: this.timeoutDuration }));
			}
		} else {
			// TODO: Add documentation somewhere so the user knows which arguments are available
			message
				.reply(
					"Please provide an argument to this command, telling me what I should do."
				)
				.then((message) => message.delete({ timeout: this.timeoutDuration }));
		}
	}
}

const createNewReactRolesMessage = async () => {};
