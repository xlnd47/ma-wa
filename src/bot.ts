require("dotenv").config();
import { registerCommands, registerEvents } from "./utils/registry";
import DiscordClient from "./client/client";
const client = new DiscordClient({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
import * as mongoose from "mongoose";

(async () => {
	await mongoose.connect(process.env.MONGODB_CONNECTION_STRING ?? "mongodb://localhost:27017/", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		dbName: "mawa-dev",
	});
	await registerCommands(client, "../commands");
	await registerEvents(client, "../events");
	await client.login(process.env.DISCORD_BOT_TOKEN);
})();
