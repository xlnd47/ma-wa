import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
// const ytdl = require('ytdl-core');
import * as ytdl from 'ytdl-core';
import * as fs from 'fs';



export default class PlayCommand extends BaseCommand {
  constructor() {
    super('play', 'music', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {

    client.player.play(message, args.join(' '), true);

  }
}