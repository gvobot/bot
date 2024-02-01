import { DiscordClient } from '../../bot.js';
import { ButtonInterface } from '../../components/typings/index.js';
import { ButtonInteraction, EmbedBuilder } from 'discord.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const button: ButtonInterface = {
    customId: 'verificationInfo',
    cooldown: 5,
    permissions: ['ViewChannel'],
    interactionAuthorOnly: false,
    execute: async (interaction: ButtonInteraction, client: DiscordClient) => {
        const { guild, guildId } = interaction;
        if (!guild) return;
        if (!guildId) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        await getFooter(guild, client, embed);

        return interaction.reply({
            embeds: [
                embed
                    .setAuthor({
                        name: i18next.t('guildGate.information.author', { guild_name: guild.name, ns: 'modules' }),
                    })
                    .setDescription(
                        [
                            i18next.t('guildGate.information.description1', { ns: 'modules' }),
                            i18next.t('guildGate.information.description2', {
                                guild_name: guild.name,
                                ns: 'modules',
                            }),
                            i18next.t('guildGate.information.description3', { ns: 'modules' }),
                            i18next.t('guildGate.information.description4', { ns: 'modules' }),
                            i18next.t('guildGate.information.description5', { ns: 'modules' }),
                            i18next.t('guildGate.information.description6', { ns: 'modules' }),
                            i18next.t('guildGate.information.description7', { ns: 'modules' }),
                        ].join('\n'),
                    )
                    .setImage('https://raw.githubusercontent.com/gvobot/bot/main/images/privacy-settings.png'),
            ],
            ephemeral: true,
        });
    },
};

export default button;
