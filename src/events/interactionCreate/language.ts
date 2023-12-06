import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events, ChatInputCommandInteraction } from 'discord.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guildId } = interaction;
        if (!guildId) return;

        const guildSettings = await client.db.guild.findUnique({ where: { guildId: guildId } });
        if (!guildSettings) {
            await client.db.guild.upsert({
                where: { guildId: guildId },
                create: {
                    guildId: guildId,
                    language: 'en-US',
                    themeColor: client.config.colors.theme,
                    isMembership: false,
                },
                update: {
                    language: 'en-US',
                    themeColor: client.config.colors.theme,
                    isMembership: false,
                },
            });
        }
    },
};
export default event;
