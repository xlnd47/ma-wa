// import DiscordClient from "../../client/client";
// import { Message } from "discord.js";
// import BaseCommand from "../../utils/structures/BaseCommand";
// import { GetEmbed } from "../../utils/structures/Embed";

// export default class ReactrolesCommand extends BaseCommand {
// 	constructor() {
// 		super("reactroles", "utility", []);
// 	}

// 	async run(client: DiscordClient, message: Message, args: Array<string>) {
// 		// Check if the message already exists
// 		// Check if the reactions already exist on the message

// 		let embed = GetEmbed(
// 			"#e42643",
// 			"Choose your own roles!",
// 			"Choosing a role will allow you to see the associated channels."
// 		);
// 		let embedMessage = await message.channel.send(embed);

// 		// Save this id to the DB
// 		embedMessage.reference.messageID;
// 	}
// }
