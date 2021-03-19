import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { GuildModel } from '../../utils/models/guild.model';

export default class SetprefixCommand extends BaseCommand {
  constructor() {
    super('setprefix', 'server-config', []);
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if(!message.guild) return;
    let guild = await GuildModel.findOne({guildId: message.guild.id});

    if(!guild) return;
    if(args.length == 0){
      message.reply(`Give a prefix to set (ex. ${guild.prefix}setprefix !)`);
      return;
    }
    // if(args[0].length > 1){
    //   message.reply('Make sure your prefix is only 1 character long.');
    //   return;
    // }
    
    await guild.update({prefix: args[0]}).exec().catch(
      reason => {
        console.log(reason);
        message.reply(`Ooops, errorken`);
      }
    );
    message.reply(`New prefix set to ${args[0]}`);

  }
}