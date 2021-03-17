import Discord, { MessageEmbed } from "discord.js";

export const GetEmbed = (color: string, title: string, description: string): MessageEmbed => {
	return new Discord.MessageEmbed().setColor(color).setTitle(title).setDescription(description);
};
