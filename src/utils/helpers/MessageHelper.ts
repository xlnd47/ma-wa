import { Message } from "discord.js";
const TIMEOUT_DURATION = 3333;

export const DeleteWithDefaultTimeout = async (message: Message) => {
	await message.delete({ timeout: TIMEOUT_DURATION });
};