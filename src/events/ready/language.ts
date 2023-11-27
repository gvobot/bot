import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events } from 'discord.js';
import { loadLanguageForGuild, logger } from '../../components/handlers/exports.js';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: DiscordClient) => {
        for (const [guildId, guild] of client.guilds.cache) {
            try {
                await loadLanguageForGuild(guild);
            } catch (error) {
                logger.error(`Failed to load language for guild ${guild.name}`);
            }
        }
    },
};
export default event;
