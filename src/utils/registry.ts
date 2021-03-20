import * as path from 'path';
import { promises as fs } from 'fs';
import DiscordClient from '../client/client';
import { Player } from 'discord-player';
import { MessageEmbed } from 'discord.js';


export async function registerCommands(client: DiscordClient, dir: string = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      const { default: Command } = await import(path.join(dir, file));
      const command  = new Command();
      client.commands.set(command.getName(), command);
      command.getAliases().forEach((alias: string) => {
        client.commands.set(alias, command);
      });
    }
  }
}

export async function registerEvents(client: DiscordClient, dir: string = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      const { default: Event } = await import(path.join(dir, file));
      const event = new Event();
      client.events.set(event.getName(), event);
      client.on(event.getName(), event.run.bind(event, client));
    }
  }
}

export async function registerDiscordPlayer(client: DiscordClient){
  // Then add some messages that will be sent when the events will be triggered
  client.player

  // Send a message when a track starts
  .on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}...`))

  // Send a message when something is added to the queue
  .on('trackAdd', (message, queue, track) => message.channel.send(`${track.title} has been added to the queue!`))
  .on('playlistAdd', (message, queue, playlist) => message.channel.send(`${playlist.title} has been added to the queue (${playlist.tracks.length} songs)!`))

  // Send messages to format search results
  .on('searchResults', (message, query, tracks) => {

      const embed = new MessageEmbed()
      .setAuthor(`Here are your search results for ${query}!`)
      .setDescription(tracks.map((t, i) => `${i}. ${t.title}`))
      .setFooter('Send the number of the song you want to play!')
      message.channel.send(embed);

  })
  .on('searchInvalidResponse', (message, query, tracks, content, collector) => {

      if (content === 'cancel') {
          collector.stop()
          return message.channel.send('Search cancelled!')
      }

      message.channel.send(`You must send a valid number between 1 and ${tracks.length}!`)

  })
  .on('searchCancel', (message, query, tracks) => message.channel.send('You did not provide a valid response... Please send the command again!'))
  .on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))

  // Send a message when the music is stopped
  .on('queueEnd', (message, queue) => message.channel.send('Music stopped as there is no more music in the queue!'))
  .on('channelEmpty', (message, queue) => message.channel.send('Music stopped as there is no more member in the voice channel!'))
  .on('botDisconnect', (message) => message.channel.send('Music stopped as I have been disconnected from the channel!'))

  // Error handling
  .on('error', (error, message) => {
      switch(error){
          case 'NotPlaying':
              message.channel.send('There is no music being played on this server!')
              break;
          case 'NotConnected':
              message.channel.send('You are not connected in any voice channel!')
              break;
          case 'UnableToJoin':
              message.channel.send('I am not able to join your voice channel, please check my permissions!')
              break;
          case 'LiveVideo':
              message.channel.send('YouTube lives are not supported!')
              break;
          case 'VideoUnavailable':
              message.channel.send('This YouTube video is not available!');
              break;
          default:
              message.channel.send(`Something went wrong... Error: ${error}`)
      }
  })
}

