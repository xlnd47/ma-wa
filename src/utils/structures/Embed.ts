import { MessageEmbed } from "discord.js";

export const GetEmbed = (color: string, title: string, description: string): MessageEmbed => {
	return new MessageEmbed().setColor(color).setTitle(title).setDescription(description);
};
