import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events } from 'discord.js';
import { loadLanguageForGuilds, logger } from '../../components/handlers/exports.js';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: DiscordClient) => {
        try {
            const guilds = Array.from(client.guilds.cache.values());
            await loadLanguageForGuilds(guilds);
        } catch (error) {
            logger.error(`Failed to load languages for guilds: `, error);
        }
    },
};
export default event;
