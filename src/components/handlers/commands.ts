import { DiscordClient } from '../../bot.js';
import { CommandInterface, ObjectNameIDArray } from '../typings/index.js';
import { logger } from './exports.js';

import { ApplicationCommandDataResolvable, Events } from 'discord.js';

import { fileURLToPath, pathToFileURL } from 'node:url';
import path, { dirname } from 'node:path';
import { readdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';

export async function loadCommands(client: DiscordClient) {
    let commandsArray: Array<ApplicationCommandDataResolvable> = [];
    let commandsDevArray: Array<ApplicationCommandDataResolvable> = [];

    const rootFolderPath = dirname(fileURLToPath(import.meta.url));
    const commandsFolderPath = path.resolve(rootFolderPath, '..', '..', 'commands');

    const processFolder = async (folderPath) => {
        try {
            const files = readdirSync(folderPath);
            await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(folderPath, file);
                    const fileStat = await stat(filePath);
                    const isDirectory = fileStat.isDirectory();

                    if (isDirectory) {
                        await processFolder(filePath);
                    } else if (file.endsWith('.js')) {
                        const command: CommandInterface = (await import(pathToFileURL(filePath).toString())).default;

                        if (command.subCommand) return client.subcommands.set(command.subCommand, command);

                        client.commands.set(command.data.name, command);
                        if (file.endsWith('.dev.js')) {
                            commandsDevArray.push(command.data.toJSON());
                        } else {
                            commandsArray.push(command.data.toJSON());
                        }
                    }
                }),
            );
        } catch (error) {
            logger.error(`Error processing folder: ${folderPath}`, error);
        }
    };

    await processFolder(commandsFolderPath);
    client.on(Events.ClientReady, async () => {
        client.application?.commands.set(commandsArray);

        if (client.config.guilds)
            client.config.guilds.forEach(async (guild: ObjectNameIDArray) => {
                await client.guilds.cache.get(guild.id)?.commands.set(commandsDevArray);
            });
    });
}
