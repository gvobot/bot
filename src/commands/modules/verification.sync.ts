import { DiscordClient } from '../../bot.js';
import { SubCommand } from '../../components/typings/index.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { getGuildTheme, getFooter } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommand = {
    subCommand: 'sync.verification',
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guild, guildId, channel } = interaction;
        if (!guild) return;
        if (!guildId) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('verificationStart')
                .setDisabled(false)
                .setLabel(i18next.t('guildGate.message.buttons.start', { ns: 'modules' }))
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('verificationInfo')
                .setDisabled(false)
                .setLabel(i18next.t('guildGate.message.buttons.info', { ns: 'modules' }))
                .setStyle(ButtonStyle.Primary),
        );
        await getFooter(guild, client, embed);

        return channel?.send({
            embeds: [
                embed
                    .setAuthor({
                        name: i18next.t('guildGate.message.embed.author', {
                            guild_name: guild.name,
                            ns: 'modules',
                        }),
                    })
                    .setDescription(
                        [
                            i18next.t('guildGate.message.embed.description.value1', {
                                guild_name: guild.name,
                                ns: 'modules',
                            }),
                            i18next.t('guildGate.message.embed.description.value2', { ns: 'modules' }),
                            i18next.t('guildGate.message.embed.description.value3', { ns: 'modules' }),
                            i18next.t('guildGate.message.embed.description.value4', { ns: 'modules' }),
                            i18next.t('guildGate.message.embed.description.value5', { ns: 'modules' }),
                            i18next.t('guildGate.message.embed.description.value6', {
                                guild_name: guild.name,
                                ns: 'modules',
                            }),
                        ].join('\n'),
                    ),
            ],
            components: [buttons],
        });
    },
};
export default command;
