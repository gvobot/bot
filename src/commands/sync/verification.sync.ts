import { DiscordClient } from '../../bot.js';
import { SubCommand } from '../../components/typings/index.js';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
} from 'discord.js';
import { getGuildTheme, getFooter, checkForPermission, RoleType } from '../../components/helpers/exports.js';
import i18next from '../../components/handlers/i18n.js';

const command: SubCommand = {
    subCommand: 'sync.verification',
    execute: async (interaction: ChatInputCommandInteraction, client: DiscordClient) => {
        const { guild, guildId, channel, member } = interaction;
        if (!guild) return;
        if (!guildId) return;

        const embed = new EmbedBuilder().setColor(await getGuildTheme(guild, client));
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('verificationStart')
                .setDisabled(false)
                .setLabel(i18next.t('verification.message.buttons.start', { ns: 'modules' }))
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('verificationInfo')
                .setDisabled(false)
                .setLabel(i18next.t('verification.message.buttons.info', { ns: 'modules' }))
                .setStyle(ButtonStyle.Primary),
        );
        await getFooter(guild, client, embed);

        const isManager = await checkForPermission(member as GuildMember, RoleType.Manager);
        if (!isManager)
            return interaction.reply({
                embeds: [embed.setDescription('You do not have the required permissions.')],
                ephemeral: true,
            });

        return channel?.send({
            embeds: [
                embed
                    .setAuthor({
                        name: i18next.t('verification.message.embed.author', {
                            guild_name: guild.name,
                            ns: 'modules',
                        }),
                    })
                    .setDescription(
                        [
                            i18next.t('verification.message.embed.description.value1', {
                                guild_name: guild.name,
                                ns: 'modules',
                            }),
                            i18next.t('verification.message.embed.description.value2', { ns: 'modules' }),
                            i18next.t('verification.message.embed.description.value3', { ns: 'modules' }),
                            i18next.t('verification.message.embed.description.value4', { ns: 'modules' }),
                            i18next.t('verification.message.embed.description.value5', { ns: 'modules' }),
                            i18next.t('verification.message.embed.description.value6', {
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
