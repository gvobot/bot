import { DiscordClient } from '../../bot.js';
import { logger } from '../../components/handlers/exports.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events, Guild } from 'discord.js';

const event: EventInterface = {
    name: Events.GuildDelete,
    options: { once: false, rest: false },
    execute: async (guild: Guild, client: DiscordClient) => {
        try {
            const existingGuild = await client.db.guild.findUnique({
                where: { guildId: guild.id },
            });
            if (existingGuild) {
                await client.db.miscellaneous.delete({ where: { guildId: guild.id } });
                await client.db.moderation.delete({ where: { guildId: guild.id } });
                await client.db.verification.delete({ where: { guildId: guild.id } });
                await client.db.joinGate.delete({ where: { guildId: guild.id } });
                await client.db.guild.delete({ where: { guildId: guild.id } });
                logger.info(`Guild ${guild.name} (${guild.id}) removed from the database.`);
            }
        } catch (error) {
            logger.error('Error removing guild from the database:', error);
        }
    },
};
export default event;
