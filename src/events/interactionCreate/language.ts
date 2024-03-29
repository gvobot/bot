import { DiscordClient } from '../../bot.js';
import { EventInterface } from '../../components/typings/index.js';
import { Events, ChatInputCommandInteraction } from 'discord.js';
import { defaultLanguage } from '../../config.js';
import { changeLanguage } from '../../components/handlers/exports.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guildId } = interaction;
        if (!guildId) return;

        const guildSettings = await client.db.guild.findUnique({
            where: { guildId: guildId },
            select: { miscellaneous: true },
        });
        changeLanguage(guildSettings?.miscellaneous?.language! ?? defaultLanguage);
        if (!guildSettings) {
            await client.db.guild.upsert({
                where: { guildId: guildId },
                create: {
                    guildId: guildId,
                    isPremium: false,
                    miscellaneous: {
                        create: {
                            language: defaultLanguage,
                            themeColor: client.config.colors.theme,
                            managerRoles: [],
                            administratorRoles: [],
                            moderatorRoles: [],
                            helperRoles: [],
                        },
                    },
                },
                update: {
                    miscellaneous: {
                        update: {
                            language: defaultLanguage,
                        },
                    },
                },
            });
        }
    },
};
export default event;
