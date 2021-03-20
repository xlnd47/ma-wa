import { GuildEmoji, Message, Role } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { GuildModel } from "../../utils/models/guild.model";
import { GetEmbed } from "../../utils/structures/Embed";
import { DeleteWithDefaultTimeout } from "../../utils/helpers/MessageHelper";

export default class ReactRolesCommand extends BaseCommand {
	constructor() {
		super("reactroles", "server-config", []);
	}

	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args.length > 0) {
			switch (args[0].toLowerCase()) {
				case "create":
					await createNewReactRolesMessage(message);
					break;
				default:
					message
						.reply(`"${args[0]}" isn't a valid argument.`)
						.then((message) => DeleteWithDefaultTimeout(message));
			}
		} else {
			// TODO: Add documentation somewhere so the user knows which arguments are available
			await message
				.reply(
					"Please provide an argument to this command, telling me what I should do."
				)
				.then((message) => DeleteWithDefaultTimeout(message));
		}
	}
}

const createNewReactRolesMessage = async (message: Message) => {
	if (!message.guild) return;
	let guild = await GuildModel.findOne({ guildId: message.guild.id });

	// is er een bericht id in de db?
	if (!guild?.reactRolesMessageId) {
		// nee: kijk of er reactroles in de db zitten
		if (guild?.reactRoles?.size && guild?.reactRoles?.size > 0) {
			// ja: maak aan
			let colorMessage = "#341AC7";
			let titleMessage = "React with an emoji to get a role!";
			let descriptionMessage = "The list below describes which roles are available:\n";

			let emojis: GuildEmoji[] = [];
			guild.reactRoles.forEach((roleName, emojiName) => {
				let emoji = message.guild?.emojis.cache.find(
					(emoji) => emoji.name === emojiName
				);
				emoji && emojis.push(emoji);
				descriptionMessage += `${emoji ?? "???"} = ${roleName}\n`;
			});

			let reactRolesMessage = await message.channel.send(
				GetEmbed(colorMessage, titleMessage, descriptionMessage)
			);
			// save id in de db
			guild.updateOne({ reactRolesMessageId: reactRolesMessage.id });
			// voeg emojis toe
			await Promise.all([emojis.map((emoji) => reactRolesMessage.react(emoji))]);
			// delete user's message
			await message.delete();
			return;
		}
		// nee: skip
		await message
			.reply(
				"There were no roles found in the db. Create them first before trying to create this message."
			)
			.then((message) => DeleteWithDefaultTimeout(message));
		return;
	}

	// ja: skip
	await message
		.reply("There already is a reactroles message.")
		.then((message) => DeleteWithDefaultTimeout(message));
};
