require("dotenv").config();
import { registerCommands, registerDiscordPlayer, registerEvents } from "./utils/registry";
import DiscordClient from "./client/client";
import * as mongoose from 'mongoose';
import { Player } from "discord-player";
const client = new DiscordClient({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });


(async () => {
	await mongoose.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "mawa-dev" })
	await registerCommands(client, "../commands");
	await registerEvents(client, "../events");
	await registerDiscordPlayer(client);
	await client.login(process.env.DISCORD_BOT_TOKEN);
})();


