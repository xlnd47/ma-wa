require("dotenv").config();
import { registerCommands, registerEvents } from "./utils/registry";
import DiscordClient from "./client/client";
const client = new DiscordClient({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

(async () => {
	client.prefix = process.env.DISCORD_BOT_PREFIX;
	await registerCommands(client, "../commands");
	await registerEvents(client, "../events");
	await client.login(process.env.DISCORD_BOT_TOKEN);
})();
