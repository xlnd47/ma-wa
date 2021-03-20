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

	// TODO: Add documentation somewhere so the user knows which arguments are available
	async run(client: DiscordClient, message: Message, args: Array<string>) {
		if (args.length >= 1) {
			switch (args[0].toLowerCase()) {
				case "create":
					await createNewReactRolesMessage(message);
					break;
				case "add":
					await addNewReactRole(message, args.slice(1));
					break;
				default:
					message
						.reply(`"${args[0]}" isn't a valid argument.`)
						.then((message) => DeleteWithDefaultTimeout(message));
			}
			return;
		}

		await message
			.reply("Please provide an argument to this command, telling me what I should do.")
			.then((message) => DeleteWithDefaultTimeout(message));
	}
}

const createNewReactRolesMessage = async (message: Message) => {
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

const addNewReactRole = async (message: Message, args: Array<string>) => {
	if (!message.guild) return;
	let guild = await GuildModel.findOne({ guildId: message.guild.id });
	if (!guild) return;

	if (args.length >= 2) {
		let emojiInput = args[0];
		if (!isEmoji(emojiInput)) {
			await message.reply(`"${emojiInput}" is not a valid emoji!`);
			return;
		}

		let roleInput = args[1];
		let role = message.guild?.roles.cache.find((role) => role.name === roleInput);

		if (!role) {
			await message.reply(`"${roleInput}" is not a valid role!`);
			return;
		}

		guild.set(`reactRoles.${emojiInput}`, role.id);
		await guild
			.save()
			.catch((err) => {
				console.log(err?.message ?? err);
				message.reply(`Ooops, errorken`);
			})
			.then(() => message.reply(`Role Added succesfully!`));

		return;
	}

	await message.reply(
		`No/too few arguments provided. Make sure to provide an emoji and rolename.\nLike so: \`${guild.prefix}reactroles add EMOJI ROLE_NAME\``
	);
};

const removeEmoji = (str: string) =>
	str.replace(
		new RegExp(
			"\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]",
			"g"
		),
		""
	);
const isEmoji = (str: string) => !removeEmoji(str).length;
