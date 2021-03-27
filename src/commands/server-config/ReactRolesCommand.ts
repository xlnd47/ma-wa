import { Message, MessageReaction, User } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import DiscordClient from "../../client/client";
import { GuildModel } from "../../utils/models/guild.model";
import { GetEmbed } from "../../utils/structures/Embed";
import { deleteWithDefaultTimeoutAsync } from "../../utils/helpers/MessageHelper";

export default class ReactRolesCommand extends BaseCommand {
	constructor() {
		super("reactroles", "server-config", []);
	}

	// TODO: Add documentation somewhere so the user knows which arguments are available
	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args.length >= 1) {
			switch (args[0].toLowerCase()) {
				case "create":
					await createNewReactRolesMessageAsync(message);
					break;
				case "add":
					await addNewReactRoleAsync(message, client);
					break;
				default:
					await deleteWithDefaultTimeoutAsync(await message.reply(`"${args[0]}" isn't a valid argument.`));
			}
			return;
		}

		await deleteWithDefaultTimeoutAsync(await message.reply(
			"Please provide an argument to this command, telling me what I should do."
		));
	}
}

const createNewReactRolesMessageAsync = async (message: Message) => {
	if (!message.guild) return;
	let guild = await GuildModel.findOne({ guildId: message.guild.id });

	if (!guild?.reactRolesMessageId) {
		if (guild?.reactRoles?.size && guild?.reactRoles?.size > 0) {
			let colorMessage = "#341AC7";
			let titleMessage = "React with an emoji to get a role!";
			let descriptionMessage = "The list below describes which roles are available:\n";

			let emojis: string[] = [];
			guild.reactRoles.forEach((roleId, emoji) => {
				let role = message.guild?.roles.cache.find((role) => role.id === roleId);
				emojis.push(emoji);
				descriptionMessage += `${emoji} = ${role?.name ?? "???"}\n`;
			});

			let reactRolesMessage = await message.channel.send(
				GetEmbed(colorMessage, titleMessage, descriptionMessage)
			);

			let dbUpdate = guild.updateOne({ reactRolesMessageId: reactRolesMessage.id }).exec();

			// Maps the emoji array to promises
			await Promise.all([emojis.map((emoji) => reactRolesMessage.react(emoji)), dbUpdate]);

			await message.delete();
			return;
		}
		// nee: skip
		await deleteWithDefaultTimeoutAsync(await message.reply(
			"There were no roles found in the db. Create them first before trying to create this message."
		));
		return;
	}

	// ja: skip
	await deleteWithDefaultTimeoutAsync(await message.reply("There already is a reactroles message."));
};

const addNewReactRoleAsync = async (message: Message, client: DiscordClient) => {
	if (!message.guild) return;
	let guild = await GuildModel.findOne({ guildId: message.guild.id });
	if (!guild) return;

	const emojiRequestMessage = await message.channel.send("Step 1: React with the emoji you'd like to use");

	const emojiId = await emojiRequestMessage.awaitReactions((reaction: MessageReaction, user: User) => (user.id === message.author.id && reaction.message.id === emojiRequestMessage.id), { max: 1, time: 15000 })
		.then(async (collected) => {
			let collectedMessageReaction = collected.first();
			let collectedEmoji = collectedMessageReaction?.emoji;

			await collectedMessageReaction?.remove();
			return collectedEmoji?.id ?? collectedEmoji?.name;
		});

	if (emojiId) {
		await deleteWithDefaultTimeoutAsync(await message.reply("Received the emoji!"));
	} else {
		await Promise.all([emojiRequestMessage.delete(), deleteWithDefaultTimeoutAsync(await message.reply("Bruh, you waited too long.. canceling this command."))]);
		return;
	}

	const roleRequestMessage = await emojiRequestMessage.edit("Step 2: Say the name of the role in the current channel. (CASE SENSITIVE)");

	const roleId = await roleRequestMessage.channel.awaitMessages((m: Message) => (m.author.id === message.author.id), { max: 1, time: 15000 })
		.then(async (collected) => {
			let collectedMessage = collected.first();
			let foundRole = message.guild?.roles.cache.find(r => r.name === collectedMessage?.content);

			await collectedMessage?.delete();
			return foundRole?.id;
		});

	if (roleId) {
		await deleteWithDefaultTimeoutAsync(await message.reply("Found your role!"));
	} else {
		await Promise.all([
			roleRequestMessage.delete(),
			deleteWithDefaultTimeoutAsync(await message.reply("The provided role name was not found or you waited too long. Canceling the command."))
		]);
		return;
	}

	guild.set(`reactRoles.${emojiId}`, roleId);
	await guild
		.save()
		.catch((err) => {
			console.log(err?.message || err);
			message.reply(`Ooops, errorken`);
		})
	await roleRequestMessage.edit(`\`ReactionRole added succesfully! ( ${emojiId} - ${roleId} )\``);
};
